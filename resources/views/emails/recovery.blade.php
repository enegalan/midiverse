<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Account Recovery</title>
</head>
<body>
    <h1>Account Recovery</h1>
    <p>Hello,</p>
    <p>We received a request to recover your account. Please click the link below to reset your password:</p>
    <p>
        <a href="{{ $link }}">{{ $link }}</a>
    </p>
    <p>If you did not request account recovery, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The {{ config('app.name') }} Team</p>
</body>
</html>