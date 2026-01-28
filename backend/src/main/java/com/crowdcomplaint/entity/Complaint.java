package com.crowdcomplaint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String category;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private User citizen;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private User assignedOfficer;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Lob
    @Column(name = "image", columnDefinition = "CLOB")
    private String image;

    @Lob
    @Column(name = "resolution_image", columnDefinition = "CLOB")
    private String resolutionImage;

    @Column(columnDefinition = "integer default 0")
    private int upvotes = 0;

    private Double latitude;
    private Double longitude;

    public enum Status {
        PENDING,
        ASSIGNED,
        IN_PROGRESS,
        RESOLVED,
        REJECTED
    }

    public Complaint() {
    }

    public Complaint(Long id, String title, String description, Status status, String category, User citizen,
            User assignedOfficer, LocalDateTime createdAt, String image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.category = category;
        this.citizen = citizen;
        this.assignedOfficer = assignedOfficer;
        this.createdAt = createdAt;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public User getCitizen() {
        return citizen;
    }

    public void setCitizen(User citizen) {
        this.citizen = citizen;
    }

    public User getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(User assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getResolutionImage() {
        return resolutionImage;
    }

    public void setResolutionImage(String resolutionImage) {
        this.resolutionImage = resolutionImage;
    }

    public int getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
