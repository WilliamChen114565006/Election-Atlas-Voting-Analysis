package com.spring;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Repository.LARepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Model.Feature;

import org.springframework.web.bind.annotation.PathVariable;
import java.io.IOException;
import java.nio.file.Files;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {

    @Autowired
    private LARepo laRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Get all Features
    @GetMapping("/test")
    public List<Feature> getAllFeatures() {
        return laRepo.findAll();
    }

    
    //endpoint for each districts, fetching information based on the districts (GUI 4)
    @GetMapping("/info/Districts/{state}/{districtNum}")
    public String getDistrictInfo(@RequestParam String param) {
        return new String();
    }
    

    //endpoint for charts
    @GetMapping("/Data/chart/{state}/{chartType}")
    public String getChartInfo(@RequestParam String param) {
        return new String();
    }
    

    //endpoint for the general info, fetching for infoPanel information about the state (GUI 3)
    @GetMapping("/info/{state}")
    public Map<String, Object> getGeneralInfo(@PathVariable String state) throws IOException {
        String filename;
        switch (state.toLowerCase()) {
            case "louisiana":
                filename = "info/LAInfo.json";
                break;
            case "new jersey":
                filename = "info/NJInfo.json";
                break;
            default:
                throw new IllegalArgumentException("State data not available");
        }

        // Load JSON file from resources folder
        ClassPathResource resource = new ClassPathResource(filename);
        return objectMapper.readValue(resource.getInputStream(), Map.class);
    }
    

    @GetMapping("/Data/colors/{category}")
    public Map<String, String> getColors(@PathVariable String category) {
        try {
            ClassPathResource resource = new ClassPathResource("colors/" + category.toLowerCase() + ".json");
            return objectMapper.readValue(resource.getInputStream(), Map.class);
        } catch (IOException e) {
            e.printStackTrace();
            return Map.of(); 
        }
    }
    
    @GetMapping("/Data/{state}/{geoLevel}/{fileType}")
    public ResponseEntity<String> getGeoJson(@PathVariable String state, @PathVariable String geoLevel, @PathVariable String fileType) throws IOException {
        Resource resource = new ClassPathResource(state + geoLevel + "." + fileType);
        String GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(GeoJson);
    }
}

