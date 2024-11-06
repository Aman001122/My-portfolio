<?php
session_start();

// Set response header for JSON output
header("Content-Type: application/json");

// CSRF Token Check
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid CSRF token.']);
        exit();
    }

    // Database Connection (Assume PDO for more security and flexibility)
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=your_database", "username", "password");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
        exit();
    }

    // Validate and Sanitize Inputs
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));

    if (!$name || !$email || !$message) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required and must be valid.']);
        exit();
    }

    // Prepared Statement for Secure Insertion
    try {
        $stmt = $pdo->prepare("INSERT INTO submissions (name, email, message, submitted_at) VALUES (:name, :email, :message, NOW())");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to submit. Please try again later.']);
        exit();
    }

    // Send Confirmation Email (Assumes mail server is configured)
    $to = $email;
    $subject = "Thank you for your submission!";
    $body = "Dear $name,\n\nThank you for reaching out! We have received your message:\n\n$message\n\nWe will get back to you soon.\n\nBest Regards,\nYour Website Team";
    $headers = "From: noreply@yourwebsite.com\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully and confirmation email sent.']);
    } else {
        echo json_encode(['status' => 'warning', 'message' => 'Form submitted successfully, but email confirmation failed.']);
    }

    // Optional: Log the Submission (assuming a log.txt file is writable)
    $logMessage = "[" . date('Y-m-d H:i:s') . "] Name: $name, Email: $email, Message: $message\n";
    file_put_contents('log.txt', $logMessage, FILE_APPEND);

} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

// Regenerate CSRF token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>
