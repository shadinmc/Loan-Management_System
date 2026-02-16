package com.lms.testutil;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.slf4j.LoggerFactory;

import java.util.List;

public final class LogCaptureUtil implements AutoCloseable {

    private final Logger logger;
    private final ListAppender<ILoggingEvent> appender;

    private LogCaptureUtil(Logger logger, ListAppender<ILoggingEvent> appender) {
        this.logger = logger;
        this.appender = appender;
    }

    public static LogCaptureUtil captureFor(Class<?> clazz) {
        Logger logger = (Logger) LoggerFactory.getLogger(clazz);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);
        return new LogCaptureUtil(logger, appender);
    }

    public List<ILoggingEvent> events() {
        return appender.list;
    }

    public List<String> messages() {
        return appender.list.stream()
                .map(ILoggingEvent::getFormattedMessage)
                .toList();
    }

    public boolean contains(String fragment) {
        return appender.list.stream()
                .map(ILoggingEvent::getFormattedMessage)
                .anyMatch(message -> message.contains(fragment));
    }

    public long countContaining(String fragment) {
        return appender.list.stream()
                .map(ILoggingEvent::getFormattedMessage)
                .filter(message -> message.contains(fragment))
                .count();
    }

    public ILoggingEvent firstEventContaining(String fragment) {
        return appender.list.stream()
                .filter(event -> event.getFormattedMessage().contains(fragment))
                .findFirst()
                .orElse(null);
    }

    @Override
    public void close() {
        logger.detachAppender(appender);
        appender.stop();
    }
}