package com.lms.audit.service;

import com.lms.audit.dto.AuditLogPageResponse;
import com.lms.audit.dto.AuditLogResponse;
import com.lms.audit.entity.AuditLog;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuditLogQueryService {

    private static final DateTimeFormatter TS_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                    .withZone(ZoneId.systemDefault());

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogPageResponse getAuditLogs(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        PageRequest pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<AuditLog> logsPage = auditLogRepository.findAllBy(pageable);
        Map<String, String> actorByUserId = resolveActorEmails(logsPage.getContent());
        List<AuditLogResponse> content = logsPage.getContent().stream()
                .map(log -> mapLog(log, actorByUserId))
                .toList();

        return new AuditLogPageResponse(
                content,
                logsPage.getNumber(),
                logsPage.getSize(),
                logsPage.getTotalElements(),
                logsPage.getTotalPages(),
                logsPage.isFirst(),
                logsPage.isLast()
        );
    }

    public ExportFile exportAuditLogs(String format) {
        String normalized = format == null ? "excel" : format.trim().toLowerCase();
        List<AuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        Map<String, String> actorByUserId = resolveActorEmails(logs);
        return switch (normalized) {
            case "excel", "xlsx" -> new ExportFile(
                    "audit-logs.csv",
                    "text/csv",
                    toExcelCsv(logs, actorByUserId)
            );
            case "notepad", "txt", "text" -> new ExportFile(
                    "audit-logs.txt",
                    "text/plain",
                    toText(logs, actorByUserId)
            );
            case "pdf" -> new ExportFile(
                    "audit-logs.pdf",
                    "application/pdf",
                    toPdf(logs, actorByUserId)
            );
            default -> throw new IllegalArgumentException(
                    "Invalid format. Allowed values: excel, txt, pdf"
            );
        };
    }

    private AuditLogResponse mapLog(AuditLog log, Map<String, String> actorByUserId) {
        return new AuditLogResponse(
                log.getId(),
                log.getAuditSequence(),
                log.getCorrelationId(),
                resolveActor(log.getUserId(), actorByUserId),
                log.getAction(),
                log.getResourceType(),
                log.getResourceId(),
                log.getHttpStatus(),
                log.isSuccess(),
                log.getRequestPayloadMasked(),
                log.getResponsePayloadMasked(),
                log.getCreatedAt()
        );
    }

    private byte[] toExcelCsv(List<AuditLog> logs, Map<String, String> actorByUserId) {
        StringBuilder builder = new StringBuilder();
        builder.append("Sequence,Timestamp,User,Action,ResourceType,ResourceId,HTTP,Success,CorrelationId\n");
        for (AuditLog log : logs) {
            builder.append(csv(log.getAuditSequence() == null ? "" : String.valueOf(log.getAuditSequence()))).append(',');
            builder.append(csv(formatTs(log))).append(',');
            builder.append(csv(resolveActor(log.getUserId(), actorByUserId))).append(',');
            builder.append(csv(nvl(log.getAction()))).append(',');
            builder.append(csv(nvl(log.getResourceType()))).append(',');
            builder.append(csv(nvl(log.getResourceId()))).append(',');
            builder.append(csv(String.valueOf(log.getHttpStatus()))).append(',');
            builder.append(csv(log.isSuccess() ? "YES" : "NO")).append(',');
            builder.append(csv(nvl(log.getCorrelationId()))).append('\n');
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    private byte[] toText(List<AuditLog> logs, Map<String, String> actorByUserId) {
        StringBuilder builder = new StringBuilder();
        for (AuditLog log : logs) {
            builder.append("Sequence: ").append(log.getAuditSequence()).append('\n');
            builder.append("Timestamp: ").append(formatTs(log)).append('\n');
            builder.append("User: ").append(resolveActor(log.getUserId(), actorByUserId)).append('\n');
            builder.append("Action: ").append(nvl(log.getAction())).append('\n');
            builder.append("Resource: ").append(nvl(log.getResourceType()))
                    .append(" / ").append(nvl(log.getResourceId())).append('\n');
            builder.append("HTTP: ").append(log.getHttpStatus()).append('\n');
            builder.append("Success: ").append(log.isSuccess() ? "YES" : "NO").append('\n');
            builder.append("CorrelationId: ").append(nvl(log.getCorrelationId())).append('\n');
            builder.append("Request: ").append(nvl(log.getRequestPayloadMasked())).append('\n');
            builder.append("Response: ").append(nvl(log.getResponsePayloadMasked())).append('\n');
            builder.append("------------------------------------------------------------").append('\n');
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    private byte[] toPdf(List<AuditLog> logs, Map<String, String> actorByUserId) {
        List<String[]> rows = logs.stream()
                .map(log -> new String[]{
                        fitForPdfCell(nvl(log.getAuditSequence() == null ? null : String.valueOf(log.getAuditSequence())), 7),
                        fitForPdfCell(formatTs(log), 19),
                        fitForPdfCell(resolveActor(log.getUserId(), actorByUserId), 14),
                        fitForPdfCell(nvl(log.getAction()), 18),
                        fitForPdfCell(nvl(log.getResourceType()), 14),
                        fitForPdfCell(nvl(log.getResourceId()), 14),
                        fitForPdfCell(String.valueOf(log.getHttpStatus()), 4),
                        fitForPdfCell(log.isSuccess() ? "YES" : "NO", 7)
                })
                .toList();
        return buildTablePdf(rows);
    }

    private Map<String, String> resolveActorEmails(List<AuditLog> logs) {
        Set<String> ids = new HashSet<>();
        for (AuditLog log : logs) {
            String actor = log.getUserId();
            if (actor == null || actor.isBlank() || actor.contains("@")) {
                continue;
            }
            ids.add(actor);
        }
        if (ids.isEmpty()) {
            return Map.of();
        }

        Map<String, String> result = new HashMap<>();
        for (User user : userRepository.findAllById(ids)) {
            if (user.getId() != null && user.getEmail() != null && !user.getEmail().isBlank()) {
                result.put(user.getId(), user.getEmail());
            }
        }
        return result;
    }

    private String resolveActor(String actorValue, Map<String, String> actorByUserId) {
        if (actorValue == null || actorValue.isBlank()) {
            return "";
        }
        return actorByUserId.getOrDefault(actorValue, actorValue);
    }

    private byte[] buildTablePdf(List<String[]> rows) {
        try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            String[] headers = {"Seq", "Timestamp", "User", "Action", "ResType", "ResId", "HTTP", "Status"};
            int[] colWidths = {40, 95, 70, 90, 80, 80, 35, 45};
            int rowHeight = 12;
            int topY = 800;
            int bottomY = 70;
            int startX = 30;
            int tableWidth = 535;
            int dataRowsPerPage = Math.max(1, ((topY - bottomY) / rowHeight) - 1);

            int pageCount = Math.max(1, (int) Math.ceil(rows.size() / (double) dataRowsPerPage));
            int firstPageObj = 3;
            int firstContentObj = firstPageObj + pageCount;
            int fontObj = firstContentObj + pageCount;
            int maxObj = fontObj;

            List<Integer> offsets = new ArrayList<>();
            offsets.add(0);
            for (int i = 1; i <= maxObj; i++) {
                offsets.add(0);
            }

            writeAscii(out, "%PDF-1.4\n");

            offsets.set(1, out.size());
            writeAscii(out, "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

            StringBuilder kids = new StringBuilder();
            for (int i = 0; i < pageCount; i++) {
                kids.append(firstPageObj + i).append(" 0 R ");
            }

            offsets.set(2, out.size());
            writeAscii(out, "2 0 obj\n<< /Type /Pages /Kids [" + kids + "] /Count " + pageCount + " >>\nendobj\n");

            for (int pageIndex = 0; pageIndex < pageCount; pageIndex++) {
                int pageObj = firstPageObj + pageIndex;
                int contentObj = firstContentObj + pageIndex;
                offsets.set(pageObj, out.size());
                writeAscii(out, pageObj + " 0 obj\n");
                writeAscii(out, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ");
                writeAscii(out, "/Resources << /Font << /F1 " + fontObj + " 0 R >> >> ");
                writeAscii(out, "/Contents " + contentObj + " 0 R >>\nendobj\n");
            }

            for (int pageIndex = 0; pageIndex < pageCount; pageIndex++) {
                int contentObj = firstContentObj + pageIndex;
                int start = pageIndex * dataRowsPerPage;
                int end = Math.min(start + dataRowsPerPage, rows.size());
                int rowCountOnPage = 1 + Math.max(end - start, 1); // header + at least one row
                int tableHeight = rowCountOnPage * rowHeight;
                int yBottom = topY - tableHeight;

                StringBuilder stream = new StringBuilder();

                // Draw outer border
                stream.append("0.5 w\n");
                stream.append(startX).append(" ").append(yBottom).append(" ")
                        .append(tableWidth).append(" ").append(tableHeight).append(" re S\n");

                // Horizontal lines
                for (int i = 1; i < rowCountOnPage; i++) {
                    int y = topY - (i * rowHeight);
                    stream.append(startX).append(" ").append(y).append(" m ")
                            .append(startX + tableWidth).append(" ").append(y).append(" l S\n");
                }

                // Vertical lines
                int runningX = startX;
                for (int i = 0; i < colWidths.length - 1; i++) {
                    runningX += colWidths[i];
                    stream.append(runningX).append(" ").append(yBottom).append(" m ")
                            .append(runningX).append(" ").append(topY).append(" l S\n");
                }

                // Write header + rows text
                stream.append("BT\n/F1 8 Tf\n");
                int headerBaseY = topY - 9;
                int textX = startX + 2;
                for (int col = 0; col < headers.length; col++) {
                    stream.append("1 0 0 1 ").append(textX).append(" ").append(headerBaseY).append(" Tm ")
                            .append("(").append(escapePdfLiteral(fitForPdfCell(headers[col], 18))).append(") Tj\n");
                    textX += colWidths[col];
                }

                if (start == end) {
                    int emptyY = topY - rowHeight - 9;
                    stream.append("1 0 0 1 ").append(startX + 2).append(" ").append(emptyY)
                            .append(" Tm (No audit logs found.) Tj\n");
                } else {
                    for (int row = start; row < end; row++) {
                        int rowBaseY = topY - ((row - start + 1) * rowHeight) - 9;
                        textX = startX + 2;
                        String[] data = rows.get(row);
                        for (int col = 0; col < headers.length; col++) {
                            String cell = col < data.length ? data[col] : "";
                            stream.append("1 0 0 1 ").append(textX).append(" ").append(rowBaseY).append(" Tm ")
                                    .append("(").append(escapePdfLiteral(cell)).append(") Tj\n");
                            textX += colWidths[col];
                        }
                    }
                }
                stream.append("ET\n");

                byte[] streamBytes = stream.toString().getBytes(StandardCharsets.US_ASCII);
                offsets.set(contentObj, out.size());
                writeAscii(out, contentObj + " 0 obj\n");
                writeAscii(out, "<< /Length " + streamBytes.length + " >>\nstream\n");
                out.write(streamBytes);
                writeAscii(out, "endstream\nendobj\n");
            }

            offsets.set(fontObj, out.size());
            writeAscii(out, fontObj + " 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

            int xrefOffset = out.size();
            writeAscii(out, "xref\n0 " + (maxObj + 1) + "\n");
            writeAscii(out, "0000000000 65535 f \n");
            for (int i = 1; i <= maxObj; i++) {
                writeAscii(out, String.format("%010d 00000 n \n", offsets.get(i)));
            }

            writeAscii(out, "trailer\n<< /Size " + (maxObj + 1) + " /Root 1 0 R >>\n");
            writeAscii(out, "startxref\n" + xrefOffset + "\n%%EOF");

            return out.toByteArray();
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to generate PDF file", e);
        }
    }

    private void writeAscii(java.io.ByteArrayOutputStream out, String value) throws java.io.IOException {
        out.write(value.getBytes(StandardCharsets.US_ASCII));
    }

    private String escapePdfLiteral(String value) {
        StringBuilder escaped = new StringBuilder(value.length());
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            if (ch == '\\' || ch == '(' || ch == ')') {
                escaped.append('\\');
            }
            escaped.append(ch);
        }
        return escaped.toString();
    }

    private String fitForPdfCell(String text, int maxChars) {
        String safe = sanitizeForPdf(text);
        if (safe.length() <= maxChars) {
            return safe;
        }
        if (maxChars <= 1) {
            return safe.substring(0, maxChars);
        }
        return safe.substring(0, maxChars - 1) + ".";
    }

    private String trimForPdf(String text) {
        if (text == null) {
            return "";
        }
        return text.length() > 160 ? text.substring(0, 160) : text;
    }

    private String sanitizeForPdf(String text) {
        if (text == null) {
            return "";
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFKD);
        StringBuilder builder = new StringBuilder(normalized.length());
        for (int i = 0; i < normalized.length(); i++) {
            char ch = normalized.charAt(i);
            if (ch >= 32 && ch <= 126) {
                builder.append(ch);
            } else if (ch == '\n' || ch == '\r' || ch == '\t') {
                builder.append(' ');
            } else {
                builder.append('?');
            }
        }
        return builder.toString();
    }

    private String formatTs(AuditLog log) {
        if (log.getCreatedAt() == null) {
            return "";
        }
        return TS_FORMATTER.format(log.getCreatedAt());
    }

    private String nvl(String value) {
        return value == null ? "" : value;
    }

    private String csv(String value) {
        String safe = value == null ? "" : value;
        String escaped = safe.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    public record ExportFile(String filename, String contentType, byte[] content) {
    }
}
