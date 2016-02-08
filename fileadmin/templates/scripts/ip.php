<?php
	$ip = $_SERVER["REMOTE_ADDR"];
	$ip = str_replace(".", "", $ip);
	echo $ip;
?>