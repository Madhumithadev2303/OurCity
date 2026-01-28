package com.crowdcomplaint.repository;

import com.crowdcomplaint.entity.Complaint;
import com.crowdcomplaint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizen(User citizen);

    List<Complaint> findByAssignedOfficer(User officer);

    List<Complaint> findByStatus(Complaint.Status status);
}
