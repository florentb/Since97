<?php

/**
 * RSVP Form handler.
 *
 * PHP version 5
 *
 * @author Florent Bourgeois
 */

if (empty($_POST)
    || !isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'
) {
    exit();
}

$errors = array();

$attend = false;
$days = false;
$name = '';
$email = '';
$adults = 0;
$children = 0;
$message = '';

if (!empty($_POST['message'])) {
    $message = nl2br(filter_var($_POST['message'], FILTER_SANITIZE_STRING));
}

if (!empty($_POST['name'])) {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
} else {
    $errors[] = 'name';
}

if (!empty($_POST['attend']) && $_POST['attend'] == 'yes') {
    $attend = true;
}

if (!empty($_POST['days']) && $_POST['attend'] == 'yes') {
    $days = true;
}

if (!empty($_POST['adults'])) {
    $adults = filter_var($_POST['adults'], FILTER_SANITIZE_NUMBER_INT);
} else {
    $errors[] = 'adults';
}

if (!empty($_POST['children'])) {
    $children = filter_var($_POST['children'], FILTER_SANITIZE_NUMBER_INT);
}

if (!empty($_POST['email'])) {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'email';
    }
} else {
    $errors[] = 'email';
}

header('Content-Type: application/json');

if (empty($errors)) {
    include __DIR__.'/../vendor/autoload.php';
    include __DIR__.'/../env.php';
    $auth = array('api_key' => $config('cm_api_key'));
    $wrap = new CS_REST_Subscribers($config('cm_list_key'), $auth);
    $result = $wrap->add(
        array(
            'EmailAddress' => $email,
            'Name' => $name,
            'CustomFields' => array(
                array('Key' => 'Nombreadultes', 'Value' => $adults),
                array('Key' => 'Nombreenfants', 'Value' => $children),
                array(
                    'Key' => 'Jeseraiprésent',
                    'Value' => ($attend) ? 'oui' : 'non'
                ),
                array(
                    'Key' => 'Jeresteraiquelquesjours',
                    'Value' => ($days) ? 'oui' : 'non'
                ),
            ),
            'Resubscribe' => true,
        )
    );

    if (!empty($message)) {
        $email_subject = '[Since97] RSVP '.$name;
        $email_headers = 'MIME-Version: 1.0'."\r\n";
        $email_headers .= 'Content-type: text/html; charset=utf-8'."\r\n";
        $email_headers .= 'Reply-To: '.$email."\r\n";
        $email_body = $message.'<br><br>'."\n\n".$name.'<br>'."\n";
        mail($config('email_to'), $email_subject, $email_body, $email_headers);
    }

    if ($result->was_successful()) {
        echo json_encode(array('response' => 'success'));
    } else {
        echo json_encode(
            array(
                'response' => 'error',
                'errors' => array(
                    'CM error: '.$result->http_status_code
                )
            )
        );
    }
} else {
    echo json_encode(
        array(
            'response' => 'error',
            'errors' => $errors
        )
    );
}
