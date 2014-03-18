<?php
$fileName = $_FILES['fileAttachment']['name'];
$fileType = $_FILES['fileAttachment']['type'];
$fileContent = file_get_contents($_FILES['fileAttachment']['tmp_name']);
$dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);
 

$json = json_encode(array(
  'fileName' => $fileName,
  'fileType' => $fileType,
  'dataUrl' => $dataUrl,
  'from' => $_REQUEST['from'],
  'subject' => $_REQUEST['subject'],
  'body' => $_REQUEST['body']
));
 
echo $json;
?>