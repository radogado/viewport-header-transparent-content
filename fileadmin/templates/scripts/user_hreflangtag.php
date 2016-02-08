<?php

//require_once(PATH_tslib . 'class.tslib_pibase.php');

class user_hreflangtag
{

	var $cObj;

	function main($content, $conf)
	{

		$this->conf = $conf;
		$lang = $GLOBALS['TSFE']->sys_language_uid;
		$id = intval($GLOBALS['TSFE']->id);
		$aReturn = array();
		if ($lang != 0) {
			$resDefault = $GLOBALS['TYPO3_DB']->exec_SELECTquery(
				'*',
				'pages',
				'uid=' . $id . ' AND deleted=0 AND hidden=0 '
			);
			echo $GLOBALS['TYPO3_DB']->sql_error();
			while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($resDefault)) {
				$conf = array(
					'parameter' => $id,
					'additionalParams' => '&L=' . $row['sys_language_uid'],
					'returnLast' => 'url'
				);
				$link = $this->cObj->typolink($row['title'], $conf);
				$country = explode('/', $link);
				if($country[0]=='cn'){
					$country[0]='zh';
				}elseif($country[0]=='cz'){
					$country[0]='cs';
				}elseif($country[0]=='gr'){
					$country[0]='el';
				}

				$aReturn[] = '<link rel="alternate" hreflang="' . strtoupper($country[0]) . '" href="https://www.skrill.com/' . $link . '">';
			}
		}

		$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery(
			'*',
			'pages_language_overlay as p, sys_language as l',
			'p.sys_language_uid<>' . $lang . ' AND p.sys_language_uid=l.uid AND p.pid=' . $id . ' AND p.deleted=0 AND p.hidden=0 '
		);
		echo $GLOBALS['TYPO3_DB']->sql_error();


		while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
			$conf = array(
				'parameter' => $id,
				'additionalParams' => '&L=' . $row['sys_language_uid'],
				'returnLast' => 'url'
			);
			$link = $this->cObj->typolink($row['title'], $conf);
			$country = explode('/', $link);
			if($country[0]=='cn'){
				$country[0]='zh';
			}elseif($country[0]=='cz'){
				$country[0]='cs';
			}elseif($country[0]=='gr'){
				$country[0]='el';
			}

			$aReturn[] = '<link rel="alternate" hreflang="' . strtoupper($country[0]) . '" href="https://www.skrill.com/' . $link . '">';
		}
		return implode("\n", $aReturn);

	}
}
