<?php
$fileName = $_FILES['fileAttachment']['name'];
$fileType = $_FILES['fileAttachment']['type'];
$fileContent = file_get_contents($_FILES['fileAttachment']['tmp_name']);
$dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);
 

$json = json_encode(array(
  'fileAttachment' => array(
    'name' => $fileName,
    'type' => $fileType,
    'data' => $dataUrl
  ),
  'from' => $_REQUEST['from'],
  'subject' => $_REQUEST['subject'],
  'body' => $_REQUEST['body'],
  'nestedObject' => array(
    'nest' => $_REQUEST["nestedObject.nest"]
  )
));
 
echo $json;
?>