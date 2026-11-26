package com.campusmap.routing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.sql.Time;

@RestController
public class ClassController {
    private final JdbcTemplate jdbc;

    public ClassController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }


    @Transactional
    @PostMapping("/api/classes")
    public ResponseEntity<Map<String, Object>> addClass(@RequestBody ClassRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String sql = "SELECT id FROM users WHERE username = ?";

        List<Long> userIds = jdbc.query(sql, (row, rowNumber) -> row.getLong("id"), principal.getName()
        );
        if (userIds.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        long userId = userIds.get(0);
        String insertClassSql = "INSERT INTO saved_classes (user_id, class_name, building_key, room_number) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    insertClassSql,
                    Statement.RETURN_GENERATED_KEYS
            );

            statement.setLong(1, userId);
            statement.setString(2, request.name());
            statement.setString(3, request.loc());
            statement.setString(4, request.room());

            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException("The class insert did not return an ID.");
        }

        long classId = generatedId.longValue();
        String insertMeetingSql = "INSERT INTO class_meetings (saved_class_id, day_of_week, start_time, end_time, class_color) VALUES (?, ?, ?, ?, ?)";
        String classColor = request.color().substring(1);
        DateTimeFormatter timeFormat = new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .appendPattern("h:mma")
                .toFormatter(Locale.ENGLISH);

        LocalTime start = LocalTime.parse(request.start(), timeFormat);
        LocalTime end = LocalTime.parse(request.end(), timeFormat);
        String dayOfWeek = switch (request.day()) {
            case "Mon" -> "Monday";
            case "Tues" -> "Tuesday";
            case "Wed" -> "Wednesday";
            case "Thurs" -> "Thursday";
            case "Fri" -> "Friday";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown day.");
        };
        jdbc.update(insertMeetingSql, classId, dayOfWeek, Time.valueOf(start), Time.valueOf(end), classColor);
        return ResponseEntity.status(201).body(
                Map.of("id", classId)
        );

    }
    @GetMapping("/api/classes")
    public ResponseEntity<List<Map<String, Object>>> getClasses(
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String selectClassesSql = "SELECT c.id, c.class_name, c.building_key, c.room_number, m.day_of_week, m.start_time, m.end_time, m.class_color FROM saved_classes AS c JOIN class_meetings AS m ON m.saved_class_id = c.id JOIN users AS u ON u.id = c.user_id WHERE u.username = ? ORDER BY c.id, m.day_of_week, m.start_time";
        String userName = principal.getName();
        DateTimeFormatter displayTimeFormat = DateTimeFormatter.ofPattern("h:mma", Locale.ENGLISH);

        List<Map<String, Object>> classes = jdbc.query(
                selectClassesSql,
                (row, rowNumber) -> {
                    Map<String, Object> savedClass = new HashMap<>();

                    savedClass.put("id", row.getLong("id"));
                    savedClass.put("name", row.getString("class_name"));
                    savedClass.put("loc", row.getString("building_key"));
                    savedClass.put("room", row.getString("room_number"));
                    String day = switch (row.getString("day_of_week")) {
                        case "Monday" -> "Mon";
                        case "Tuesday" -> "Tues";
                        case "Wednesday" -> "Wed";
                        case "Thursday" -> "Thurs";
                        case "Friday" -> "Fri";
                        default -> throw new IllegalStateException("Unknown stored day.");
                    };

                    savedClass.put("day", day);
                    String color = "#" + row.getString("class_color");
                    savedClass.put("color", color);
                    LocalTime start = row.getTime("start_time").toLocalTime();
                    LocalTime end = row.getTime("end_time").toLocalTime();

                    savedClass.put("start", start.format(displayTimeFormat).toLowerCase(Locale.ENGLISH)
                    );

                    savedClass.put("end", end.format(displayTimeFormat).toLowerCase(Locale.ENGLISH)
                    );


                    return savedClass;
                },
                userName
        );

        return ResponseEntity.ok(classes);
    }

}
