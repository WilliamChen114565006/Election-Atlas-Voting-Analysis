package com.Model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "boxAndWhiskers")
public class BoxAndWhiskerLAModel {
    private String state;
    private String type;
    private Map<String, Object> White_POP;
    private Map<String, Object> Black_POP;
    private Map<String, Object> Asian_POP;
    private Map<String, Object> Native_POP;
    private Map<String, Object> Pacific_POP;
}
