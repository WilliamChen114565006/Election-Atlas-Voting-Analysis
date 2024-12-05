package com.spring;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Repository.PrecinctRepository;
import com.Repository.StateSummaryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Model.PrecinctModel;
import com.Model.StateSummary;
import com.Model.DistrictBoundary;
import com.Model.CongressionalTable;
import com.Model.GinglesData;
import com.Model.GinglesIncomeData;
import com.Repository.DistrictBoundaryRepository;
import com.Repository.GinglesIncomeDataRepository;
import com.Repository.GinglesRaceDataRepository;
import com.Model.BoxAndWhiskerLAModel;
import com.Repository.BoxAndWhiskerLARepository;
import com.Repository.CongressionalTableRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.web.bind.annotation.PathVariable;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {
    private static final String SUMMARY_CACHE_KEY_SUFFIX = "summaryKey";
    private static final String PRECINCT_BOUNDARY_CACHE_KEY_SUFFIX = "precinctBoundaryKey";
    private static final String DISTRICT_KEY_SUFFIX = "districtKey";
    private static final String BW_KEY_SUFFIX = "bwKey";
    private static final String CONGRESSIONAL_TABLE_CACHE_KEY_SUFFIX = "congressionalTableKey";
    private static final String GINGLES_CACHE_KEY_SUFFIX = "ginglesKey";
    private static final String SUMMARY_CACHE="stateSummaryData";
    private static final String PRECINCT_CACHE="precinctData";
    private static final String DISTRICT_CACHE="districtData";
    private static final String BW_CACHE="bwData";
    private static final String CONGRESSIONAL_TABLE_CACHE="congressionalCache";
    private static final String GINGLES_CACHE="ginglesCache";
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Autowired
    private CacheHandler cacheHandler;

    @Autowired
    private StateSummaryRepository stateSumRepo;

    @Autowired
    private GinglesRaceDataRepository ginglesRepo;

    @Autowired
    private GinglesIncomeDataRepository ginglesIncomeRepo;

    @Autowired
    private CongressionalTableRepository congressTableRepo;

    @Autowired
    private PrecinctRepository PrecinctRepo;

    @Autowired
    private DistrictBoundaryRepository DistrictRepo;

    @Autowired
    private BoxAndWhiskerLARepository BoxAndWhiskRepo;

    @GetMapping("/info/{state}")
    public ResponseEntity<Map<String, Object>> getStateSummary(@PathVariable String state) {
        String cacheKey = state + SUMMARY_CACHE_KEY_SUFFIX;
        String cacheName = SUMMARY_CACHE;
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return ResponseEntity.ok(cachedData);
        }
        StateSummary summary = stateSumRepo.findByStateIgnoreCase(state);
        Map<String, Object> summaryData = summary.getSummary();
        cacheHandler.putToCache(cacheKey, summaryData, cacheName);
        return ResponseEntity.ok(summaryData);
    }

    @GetMapping("/precinct-boundary/{state}")
    public ResponseEntity<Map<String, Object>> getPrecinctBoundary(@PathVariable String state) throws IOException {
        String cacheKey = state + PRECINCT_BOUNDARY_CACHE_KEY_SUFFIX;
        String cacheName = PRECINCT_CACHE;
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return ResponseEntity.ok(cachedData);
        }
        PrecinctModel mapData= PrecinctRepo.findByStateIgnoreCase(state);
        Map<String, Object> jsonMap = objectMapper.convertValue(mapData, new TypeReference<Map<String, Object>>() {});
        cacheHandler.putToCache(cacheKey, jsonMap, cacheName);
        return ResponseEntity.ok(jsonMap);
    }

    @GetMapping("/district-boundary/{state}")
    public ResponseEntity<Map<String, Object>> getDistrictBoundary(@PathVariable String state) throws IOException {
        String cacheKey=state+DISTRICT_KEY_SUFFIX;
        String cacheName = DISTRICT_CACHE;
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return ResponseEntity.ok(cachedData);
        }
        DistrictBoundary mapData= DistrictRepo.findByStateIgnoreCase(state);
        Map<String, Object> jsonMap = objectMapper.convertValue(mapData, new TypeReference<Map<String, Object>>() {});
        cacheHandler.putToCache(cacheKey, jsonMap, cacheName);
        return ResponseEntity.ok(jsonMap);
    }

    @GetMapping("/box-and-whisker/{state}/{type}")
    public ResponseEntity<Map<String, Object>> getBoxAndWhisker(@PathVariable String state, @PathVariable String type) throws IOException {
        String cacheKey=state+type+BW_KEY_SUFFIX;
        String cacheName=BW_CACHE;
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return ResponseEntity.ok(cachedData);
        }
        BoxAndWhiskerLAModel data=BoxAndWhiskRepo.findByStateIgnoreCaseAndTypeIgnoreCase(state, type);
        Map<String, Object> jsonData = objectMapper.convertValue(data, new TypeReference<Map<String, Object>>() {});
        jsonData.remove("state");
        jsonData.remove("type");
        cacheHandler.putToCache(cacheKey, jsonData, cacheName);
        return ResponseEntity.ok(jsonData);
    }

    @GetMapping("/congressional-table/{state}")
    public Map<String, Object> getCongressionalTable(@PathVariable String state) {
        String cacheKey = state + CONGRESSIONAL_TABLE_CACHE_KEY_SUFFIX;
        String cacheName = CONGRESSIONAL_TABLE_CACHE;
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if(cachedData != null) {
            return cachedData;
        }
        CongressionalTable congressTableData = congressTableRepo.findByStateIgnoreCase(state);
        Map<String, Object> jsonCongressionalData = objectMapper.convertValue(congressTableData, new TypeReference<Map<String, Object>>() {});
        cacheHandler.putToCache(cacheKey, jsonCongressionalData, cacheName);
        return jsonCongressionalData;
    }

    @GetMapping("/gingles/{selectedDisplay}/{state}/{race}")
    public ResponseEntity<Map<String, Object>> getGingles(@PathVariable String selectedDisplay, @PathVariable String state, @PathVariable String race) {
        String cacheKey;
        String cacheName = GINGLES_CACHE;
        if (!race.equals("noRace")) {
            cacheKey = selectedDisplay + state + race + GINGLES_CACHE_KEY_SUFFIX;
        }
        else{
            cacheKey = selectedDisplay + state + GINGLES_CACHE_KEY_SUFFIX;
        }
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if(cachedData != null){
            return ResponseEntity.ok(cachedData);
        }
        if (race.equals("noRace")) {
            GinglesIncomeData ginglesIncomeData = ginglesIncomeRepo.findByStateIgnoreCaseAndDataIgnoreCase(state, selectedDisplay);        
            Map<String, Object> ginglesSummary = objectMapper.convertValue(ginglesIncomeData, new TypeReference<Map<String, Object>>() {});
            cacheHandler.putToCache(cacheKey, ginglesSummary, cacheName);
            return ResponseEntity.ok(ginglesSummary);
        }
        GinglesData ginglesData = ginglesRepo.findByStateIgnoreCaseAndDataIgnoreCaseAndRaceIgnoreCase(state, selectedDisplay, race);
        Map<String, Object> ginglesSummary = objectMapper.convertValue(ginglesData, new TypeReference<Map<String, Object>>() {});
        cacheHandler.putToCache(cacheKey, ginglesSummary, cacheName);
        return ResponseEntity.ok(ginglesSummary);
    }

    //DEPRICATED VERSION: REMOVE WHEN NJ DISTRICT BOUNDARIES ARE PREPROCESSED
    @GetMapping("/Data/{state}/{geoLevel}/{fileType}")
    public ResponseEntity<String> getGeoJson(@PathVariable String state, @PathVariable String geoLevel, @PathVariable String fileType) throws IOException {
        Resource resource = new ClassPathResource(state + geoLevel + "." + fileType);
        String GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(GeoJson);
    }

    //NOT COMPLETE
    @GetMapping("/chart/ecological-inference")
    public ResponseEntity<Map<String, Object>> getEIData() {
        return null;
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
}

