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
import com.Repository.StateSummaryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Model.Feature;
import com.Model.StateSummary;

import org.springframework.web.bind.annotation.PathVariable;
import java.io.IOException;
import java.nio.file.Files;
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
    

   //
    
    @Autowired
    private CacheHandler cacheHandler;

    @Autowired
    private StateSummaryRepository stateSumRepo;

    //OLD CODE FOR STATE SUMMARY ENDPOINT *******
    // @GetMapping("/info/{state}/{keyName}")
    // public Map<String, Object> getStateSummary(@PathVariable String state, @PathVariable String keyName) {
    //     return cacheHandler.getStateSummaryFromCache(state, keyName);
    // }
    //***************************** */

    @GetMapping("/info/{state}/{keyName}")
    public Map<String, Object> getStateSummary(@PathVariable String state, @PathVariable String keyName) {
        String cacheKey = state + keyName;
        String cacheName = "summaryData";
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return cachedData;
        }
        StateSummary summary = stateSumRepo.findByStateIgnoreCase(state);
        Map<String, Object> summaryData = summary.getSummary();
        cacheHandler.putToCache(cacheKey, summaryData, cacheName);

        return summaryData;
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

    @GetMapping("/Data/Minority/{state}/{race}")
    public Map<String, Object> getRaceDensity(@PathVariable String state, @PathVariable String race){
        return null;
    }
    
    @GetMapping("/Data/{state}/{geoLevel}/{fileType}")
    public ResponseEntity<String> getGeoJson(@PathVariable String state, @PathVariable String geoLevel, @PathVariable String fileType) throws IOException {
        Resource resource = new ClassPathResource(state + geoLevel + "." + fileType);
        String GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(GeoJson);
    }
}

