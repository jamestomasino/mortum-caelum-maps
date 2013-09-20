<?php

//Larger images can require more memory and time
ini_set('memory_limit','2048M');
ini_set('max_execution_time','300');

//For testing purposes, I manually entered the input file name and destination folder
$destinationDir = 'tiles/';
$fileName = 'map.jpg';
if (!file_exists($destinationDir)) {
    mkdir($destinationDir, 0777, true);
}

//create transform driver object
$im = imagecreatefromjpeg($fileName);
$sizeArray = getimagesize($fileName);

//Set the Image dimensions
$imageWidth = $sizeArray[0];
$imageHeight = $sizeArray[1];

//See how many zoom levels are required for the width and height
$widthLog = ceil(log($imageWidth/256,2));
$heightLog = ceil(log($imageHeight/256,2));

//Find the maximum zoom by taking the higher of the width and height zoom levels
if ($heightLog > $widthLog)
{
    $maxZoom = $heightLog;
}
else
{
    $maxZoom = $widthLog;
}

//Go through each zoom level
for ($z =0 ; $z < $maxZoom ; $z++ )
{
    $currSize = 256 * pow(2,$z);
    for ($y = 0 ; $y * $currSize < $imageHeight ; $y++)
    {
    //if the current square on the original doesn't have the required height, we need to find the correct ratio to use or the image could be skewed
        if (($imageHeight - $y*$currSize) < $currSize)
        {
            $heightRatio = ($imageHeight-$y*$currSize)/$currSize;
        }
        else
        {
            $heightRatio = 1;
        }
	//if the current square on the original doesn't have the required width, we need to find the correct ratio to use or the image could be skewed
	for($x = 0 ; $x * $currSize < $imageWidth ; $x++)
        {
            if (($imageWidth-$x*$currSize) < $currSize)
            {
                $widthRatio = ($imageWidth-$x*$currSize)/$currSize;
            }
            else
            {
                $widthRatio = 1;
            }
		//create an image to put this tile in
	    $dest = imagecreatetruecolor(256*$widthRatio,256*$heightRatio);

	    //take the correct chunk from the original, and rescale it to fit in the tile
	    $ret = imagecopyresized($dest, $im, 0, 0, $x*$currSize, $y*$currSize, 256*$widthRatio, 256*$heightRatio, $currSize*$widthRatio, $currSize*$heightRatio);

            //save this image as a jpg, named according to its location and zoom

            $folder = $destinationDir . ($maxZoom-$z) . '/' . $x . '/';
            if (!file_exists($folder)) {
                mkdir($folder, 0777, true);
            }

            imagejpeg($dest, $folder . $y . '.jpg', 75);
            imagedestroy($dest);
        }
    }
}
?>
