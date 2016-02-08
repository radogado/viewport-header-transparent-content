<?php

//require_once(PATH_tslib . 'class.tslib_pibase.php');
//require_once (PATH_t3lib . 'class.t3lib_stdgraphic.php');
//require_once (PATH_tslib . 'class.tslib_content.php');
//require_once (PATH_tslib . 'class.tslib_gifbuilder.php');

class user_langswitch {

	var $cObj;

	function main($content, $conf) {
		global $TSFE;
		$curLang = $TSFE->sys_language_uid;
		$mode = $conf["mode"];
		// t3lib_utility_Debug::debug($this->conf, 'conf');


		if (!$curLang || $curLang == 0)
			$curLang = t3lib_div::_GP('L');

		$local_cObj = $TSFE->cObj; // cObject
		/*      $res = $GLOBALS["TYPO3_DB"]->exec_SELECTquery(
		  "uid, title, flag, tx_psclang_relatedcountry", "sys_language", "hidden=0", "", "title", ""
		  );
		 */

		$query = ('
        SELECT sl.*, sc.cn_short_local
        FROM `sys_language` sl
        LEFT JOIN static_countries sc ON sc.uid = sl.tx_psclang_settings
        WHERE sl.hidden=0 and sl.tx_psclang_showinmenu=1 and sl.' . $conf["mode"] . '
        ORDER BY   sc.cn_short_local'
		);

		$res = $GLOBALS['TYPO3_DB']->sql_query($query);

		if ($res) {
			$c_before = '';
			while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
				$uid = $row["uid"];



				//t3lib_utility_Debug::debug(t3lib_div::_GP('tx_pscnews_pscnews[news]'), lala);
				if (t3lib_div::_GP('tx_pscnews_pscnews')) {
					$newsid = t3lib_div::_GP('tx_pscnews_pscnews');

					$parameters = array(
						'L' => $row['uid'],
						'tx_pscnews_pscnews[news]' => $newsid['news'],
						'tx_pscnews_pscnews[controller]' => $newsid['controller'],
						'tx_pscnews_pscnews[action]' => $newsid['action']
					);
				} else if (t3lib_div::_GP('tx_news_pi1')) {
					$newsid = t3lib_div::_GP('tx_news_pi1');
					if ($newsid['news']>0) {
						$parameters = array(
							'L' => $row['uid'],
							'tx_news_pi1[news]' => $newsid['news'],
							'tx_news_pi1[controller]' => $newsid['controller'],
							'tx_news_pi1[action]' => $newsid['action']
						);
					} else {
						$parameters = array(
							'L' => $row['uid'],
						);
					}
				} else {

					$parameters = array(
						'L' => $row['uid'],
					);
				}
				$allreadyselected = 0;
				if ($row['tx_psclang_relatedcountry'] != "") {

					$relatedarr = explode(',', $row['tx_psclang_relatedcountry']);
					for ($i = 0; $i < sizeof($relatedarr); $i++) {
						if ($curLang == $relatedarr[$i]) {
							$selected = 'selected="selected"';

							$allreadyselected = 1;
							//exit();
						}
					}
				}
				if ($curLang == $row['uid']) {
					$selected = 'selected="selected"';
					$allreadyselected = 1;
				}
				if ($allreadyselected == 0) {
					$selected = '';
				}

				$value = '/' . $TSFE->cObj->getTypoLink_URL($TSFE->id, $parameters);

				if (substr($row['title'], 0, 5) != $c_before) {
					if (substr($row["title"], -3, 1) == " ")
						// $title = substr($row["title"], 0, (strlen($row["title"]) - 3));
						$title = $row[$conf["showfield"]];
					else
						$title = $row[$conf["showfield"]];


					$options.='<li' . $selected . '>' . $title . '</li>';
				}
				$c_before = substr($row['title'], 0, 5);
			}
		}


		// if ($curLang == $v['uid']) $selected = 'selected="selected"';

		$out = '<ul>';
		$out .= $options;
		$out .= '</ul>';




		return $out;
	}





}

?>