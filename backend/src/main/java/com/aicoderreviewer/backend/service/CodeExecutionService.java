package com.aicoderreviewer.backend.service;

import com.aicoderreviewer.backend.dto.CodeExecutionRequest;
import com.aicoderreviewer.backend.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {

    private static final boolean IS_WINDOWS = System.getProperty("os.name").toLowerCase().contains("win");

    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        long startTime = System.currentTimeMillis();
        Path tempDir = null;

        try {
            String fileName = (request.getFileName() != null && !request.getFileName().isBlank())
                    ? request.getFileName()
                    : "Main.java";

            String code = request.getCode() != null ? request.getCode() : "";

            // Create temporary working directory
            tempDir = Files.createTempDirectory("code_runner_");
            File sourceFile = new File(tempDir.toFile(), fileName);
            Files.writeString(sourceFile.toPath(), code);

            String extension = fileName.contains(".") 
                    ? fileName.substring(fileName.lastIndexOf(".")).toLowerCase() 
                    : ".java";

            switch (extension) {
                case ".py":
                case ".pyw":
                    return runCommand(tempDir, getPythonCommand(), fileName);

                case ".js":
                case ".jsx":
                case ".ts":
                case ".tsx":
                case ".mjs":
                    return runCommand(tempDir, getNodeCommand(), fileName);

                case ".java":
                    return runJava(tempDir, fileName);

                case ".cpp":
                case ".c":
                    return runCpp(tempDir, fileName);

                case ".go":
                    return runCommand(tempDir, "go", "run", fileName);

                case ".rs":
                    return runRust(tempDir, fileName);

                default:
                    return CodeExecutionResponse.builder()
                            .stdout("")
                            .stderr("Execution not supported for extension: " + extension)
                            .exitCode(1)
                            .executionTimeMs(System.currentTimeMillis() - startTime)
                            .build();
            }

        } catch (Exception e) {
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Server Execution Error: " + e.getMessage())
                    .exitCode(1)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir.toFile());
            }
        }
    }

    private CodeExecutionResponse runJava(Path tempDir, String fileName) throws Exception {
        long startTime = System.currentTimeMillis();
        
        // 1. Compile: javac Main.java
        ProcessBuilder compileBuilder = new ProcessBuilder("javac", fileName);
        compileBuilder.directory(tempDir.toFile());
        Process compileProcess = compileBuilder.start();

        boolean compileSuccess = compileProcess.waitFor(10, TimeUnit.SECONDS);
        if (!compileSuccess || compileProcess.exitValue() != 0) {
            String compileError = readStream(compileProcess.getErrorStream());
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Compilation Error:\n" + compileError)
                    .exitCode(1)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }

        // 2. Run: java ClassName
        String className = fileName.substring(0, fileName.lastIndexOf("."));
        ProcessBuilder runBuilder = new ProcessBuilder("java", className);
        runBuilder.directory(tempDir.toFile());
        
        return executeProcess(runBuilder, startTime);
    }

    private CodeExecutionResponse runCpp(Path tempDir, String fileName) throws Exception {
        long startTime = System.currentTimeMillis();
        String outputBinary = IS_WINDOWS ? "program.exe" : "./program";

        // 1. Compile: g++ fileName -o outputBinary
        ProcessBuilder compileBuilder = new ProcessBuilder("g++", fileName, "-o", outputBinary);
        compileBuilder.directory(tempDir.toFile());
        Process compileProcess = compileBuilder.start();

        boolean compileSuccess = compileProcess.waitFor(10, TimeUnit.SECONDS);
        if (!compileSuccess || compileProcess.exitValue() != 0) {
            String compileError = readStream(compileProcess.getErrorStream());
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("C++ Compilation Error:\n" + compileError)
                    .exitCode(1)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }

        // 2. Run binary
        ProcessBuilder runBuilder = new ProcessBuilder(new File(tempDir.toFile(), outputBinary).getAbsolutePath());
        runBuilder.directory(tempDir.toFile());

        return executeProcess(runBuilder, startTime);
    }

    private CodeExecutionResponse runRust(Path tempDir, String fileName) throws Exception {
        long startTime = System.currentTimeMillis();
        String outputBinary = IS_WINDOWS ? "main_rs.exe" : "./main_rs";

        // 1. Compile: rustc main.rs -o binary
        ProcessBuilder compileBuilder = new ProcessBuilder("rustc", fileName, "-o", outputBinary);
        compileBuilder.directory(tempDir.toFile());
        Process compileProcess = compileBuilder.start();

        boolean compileSuccess = compileProcess.waitFor(10, TimeUnit.SECONDS);
        if (!compileSuccess || compileProcess.exitValue() != 0) {
            String compileError = readStream(compileProcess.getErrorStream());
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Rust Compilation Error:\n" + compileError)
                    .exitCode(1)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }

        // 2. Run binary
        ProcessBuilder runBuilder = new ProcessBuilder(new File(tempDir.toFile(), outputBinary).getAbsolutePath());
        runBuilder.directory(tempDir.toFile());

        return executeProcess(runBuilder, startTime);
    }

    private CodeExecutionResponse runCommand(Path tempDir, String... command) throws Exception {
        long startTime = System.currentTimeMillis();
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(tempDir.toFile());
        return executeProcess(pb, startTime);
    }

    private CodeExecutionResponse executeProcess(ProcessBuilder pb, long startTime) {
        try {
            Process process = pb.start();

            // Capped at 8 seconds execution timeout
            boolean finished = process.waitFor(8, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return CodeExecutionResponse.builder()
                        .stdout("")
                        .stderr("Execution Timed Out (Exceeded 8 Seconds Limit)")
                        .exitCode(124)
                        .executionTimeMs(System.currentTimeMillis() - startTime)
                        .build();
            }

            String stdout = readStream(process.getInputStream());
            String stderr = readStream(process.getErrorStream());
            int exitCode = process.exitValue();

            return CodeExecutionResponse.builder()
                    .stdout(stdout)
                    .stderr(stderr)
                    .exitCode(exitCode)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();

        } catch (Exception e) {
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Execution Error: " + e.getMessage())
                    .exitCode(1)
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }

    private String getPythonCommand() {
        return IS_WINDOWS ? "python" : "python3";
    }

    private String getNodeCommand() {
        return "node";
    }

    private String readStream(InputStream is) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
            return br.lines().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            return "";
        }
    }

    private void deleteDir(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) deleteDir(f);
                else f.delete();
            }
        }
        dir.delete();
    }
}
