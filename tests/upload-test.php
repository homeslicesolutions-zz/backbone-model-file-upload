<?php

// Parse as Form Data
$passthrough = $_REQUEST;

// Parse as JSON API Request
foreach (getallheaders() as $name => $value) {
  if (strpos(strtolower($name), 'content-type') > -1 
      && strpos(strtolower($value), 'json') > -1) {

      $json = file_get_contents('php://input');
      $obj = json_decode($json);

      foreach ($obj as $key => $value) {
        $passthrough[$key] = $value;
      }

      break;
  }
}


$model = array(
  'from' => $passthrough['from'],
  'subject' => $passthrough['subject'],
  'body' => $passthrough['body'],
  'nestedObject' => array(
    'nest' => $passthrough["nestedObject_nest"]
  )
);

$fileName = $_FILES['fileAttachment']['name'];
$fileType = $_FILES['fileAttachment']['type'];

if ($_FILES['fileAttachment']['tmp_name'] != "") {
  $fileContent = file_get_contents($_FILES['fileAttachment']['tmp_name']);
  $dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);

  $model['fileAttachment'] = array(
    'name' => $fileName,
    'type' => $fileType,
    'data' => $dataUrl
  );
  
}
echo json_encode($model);
?>

