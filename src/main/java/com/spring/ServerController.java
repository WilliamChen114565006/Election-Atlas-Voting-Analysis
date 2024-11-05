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
import com.Model.Feature;

import org.springframework.web.bind.annotation.PathVariable;
import java.io.IOException;
import java.nio.file.Files;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {

    @Autowired
    private LARepo laRepo;

    // Get all Features
    @GetMapping("/test")
    public List<Feature> getAllFeatures() {
        return laRepo.findAll();
    }


    @GetMapping("/Data/colors/{category}")
    public Map<String, String> getColors(@PathVariable String category) {
        LinkedHashMap<String, String> colorMap = new LinkedHashMap<>();
        
        switch (category.toLowerCase()) {
            case "income":
                colorMap.put("10k-20k", "#99ccff");
                colorMap.put("20k-35k", "#6699ff");
                colorMap.put("35k-50k", "#3366ff");
                colorMap.put("50k-100k", "#3333ff");
                colorMap.put("100k-200k", "#000066");
                colorMap.put("200k+", "#00001a");
                break;
            case "race":
                colorMap.put("91%-100%", "#B33D00");
                colorMap.put("81%-90%", "#CC4D00");
                colorMap.put("71%-80%", "#E65C00");
                colorMap.put("61%-70%", "#FF6A00");
                colorMap.put("51%-60%", "#FF7800");
                colorMap.put("41%-50%", "#FF8F1C");
                colorMap.put("31%-40%", "#FFA84C");
                colorMap.put("21%-30%", "#FFC07F");
                colorMap.put("11%-20%", "#FFD194");
                colorMap.put("0%-10%", "#FFE5B4");
                break;
            case "voting":
                colorMap.put("Republican", "red");
                colorMap.put("Democrat", "blue");
                colorMap.put("Other", "purple");
                break;
            default:
                return Map.of();
        }
        
        return colorMap;
    }
    

    @GetMapping("/Data/{state}/{geoLevel}/{fileType}")
    // @Cacheable(value = "geoJsonCache", key = "#state + '-' + #geoLevel + '-' + #fileType")
    public ResponseEntity<String> getGeoJson(@PathVariable String state, @PathVariable String geoLevel, @PathVariable String fileType) throws IOException {
        Resource resource = new ClassPathResource(state + geoLevel + "." + fileType);
        String GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(GeoJson);
    }
}

