package com.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.Model.BoxAndWhiskerLAModel;

@Repository
public interface BoxAndWhiskerLARepository extends MongoRepository<BoxAndWhiskerLAModel, String>{
    BoxAndWhiskerLAModel findByStateIgnoreCaseAndTypeIgnoreCase(String state, String type);
}
