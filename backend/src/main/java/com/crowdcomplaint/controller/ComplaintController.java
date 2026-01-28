package com.crowdcomplaint.controller;

import com.crowdcomplaint.entity.Complaint;
import com.crowdcomplaint.entity.User;
import com.crowdcomplaint.repository.ComplaintRepository;
import com.crowdcomplaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Allow frontend to access
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        // In real app, set citizen from logged in user context
        // Here we expect citizen to be passed or handled simply
        if (complaint.getCitizen() != null && complaint.getCitizen().getId() != null) {
            User citizen = userRepository.findById(complaint.getCitizen().getId()).orElse(null);
            complaint.setCitizen(citizen);
        }
        return complaintRepository.save(complaint);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestParam Complaint.Status status) {
        return complaintRepository.findById(id).map(complaint -> {
            complaint.setStatus(status);
            return ResponseEntity.ok(complaintRepository.save(complaint));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolveComplaint(@PathVariable Long id, @RequestBody Complaint update) {
        return complaintRepository.findById(id).map(complaint -> {
            if (update.getStatus() != null)
                complaint.setStatus(update.getStatus());
            if (update.getResolutionImage() != null)
                complaint.setResolutionImage(update.getResolutionImage());
            return ResponseEntity.ok(complaintRepository.save(complaint));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Complaint> assignOfficer(@PathVariable Long id, @RequestParam Long officerId) {
        return complaintRepository.findById(id).map(complaint -> {
            User officer = userRepository.findById(officerId).orElse(null);
            if (officer != null) {
                complaint.setAssignedOfficer(officer);
                complaint.setStatus(Complaint.Status.ASSIGNED);
                return ResponseEntity.ok(complaintRepository.save(complaint));
            }
            return ResponseEntity.badRequest().<Complaint>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<Complaint> upvoteComplaint(@PathVariable Long id) {
        return complaintRepository.findById(id).map(complaint -> {
            complaint.setUpvotes(complaint.getUpvotes() + 1);
            return ResponseEntity.ok(complaintRepository.save(complaint));
        }).orElse(ResponseEntity.notFound().build());
    }
}
