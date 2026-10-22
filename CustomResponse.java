package com.sheetal.habittracker.entity;

public class CustomResponse {
    // Constructors
    public CustomResponse() {}

    //fields
    private Boolean isSuccess;
    private String message;
    private Long id;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getIsSuccess() { return isSuccess; }
    public void setIsSuccess(Boolean isSuccess) { this.isSuccess = isSuccess; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
