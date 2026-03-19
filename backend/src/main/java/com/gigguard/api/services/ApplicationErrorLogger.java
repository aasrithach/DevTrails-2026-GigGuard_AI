package com.gigguard.api.services;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.ServletRequestHandledEvent;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

@Component
public class ApplicationErrorLogger {
    private final ConcurrentLinkedDeque<ErrorLog> errorLogs = new ConcurrentLinkedDeque<>();
    private static final int MAX_SIZE = 20;

    @EventListener
    public void handleRequestEvent(ServletRequestHandledEvent event) {
        if (event.wasFailure() && event.getFailureCause() != null) {
            logError(event.getFailureCause(), event.getRequestUrl());
        }
    }

    public void logError(Throwable ex, String endpoint) {
        StringWriter sw = new StringWriter();
        ex.printStackTrace(new PrintWriter(sw));
        String stackTrace = sw.toString();

        ErrorLog log = new ErrorLog(
                LocalDateTime.now(),
                endpoint != null ? endpoint : "Unknown Endpoint",
                ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName(),
                stackTrace
        );

        errorLogs.addFirst(log);
        if (errorLogs.size() > MAX_SIZE) {
            errorLogs.removeLast();
        }
    }

    public List<ErrorLog> getRecentErrors() {
        return new ArrayList<>(errorLogs);
    }

    public void clearErrors() {
        errorLogs.clear();
    }

    public static class ErrorLog {
        private LocalDateTime timestamp;
        private String endpoint;
        private String errorMessage;
        private String stackTrace;

        public ErrorLog() {}

        public ErrorLog(LocalDateTime timestamp, String endpoint, String errorMessage, String stackTrace) {
            this.timestamp = timestamp;
            this.endpoint = endpoint;
            this.errorMessage = errorMessage;
            this.stackTrace = stackTrace;
        }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public String getEndpoint() { return endpoint; }
        public void setEndpoint(String endpoint) { this.endpoint = endpoint; }
        public String getErrorMessage() { return errorMessage; }
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
        public String getStackTrace() { return stackTrace; }
        public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }
    }
}
