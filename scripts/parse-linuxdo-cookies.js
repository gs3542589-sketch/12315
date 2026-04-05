const fs = require('fs');

// Parse the cookie string from user input
const cookieString = `_ga=GA1.1.1501644856.1774698973; __stripe_mid=6cb2dedb-f67f-425f-8ecd-30b1968242d71446a8; g_state={"i_l":1,"i_ll":1774802326624,"i_b":"6xlFt+/E89bh1nyPoU9a8frDxDHUmpDTi1LS4AV8g5I","i_e":{"enable_itp_optimization":0},"i_p":1774801593049}; fp=1efbdcff1b1d2d9a8a774c664d2cac2a; __stripe_sid=8c6b19bf-e381-4ce1-8f6e-b53ab16155a832f593; _t=bFYCCFvhUHihxyk8POyRLZgziYSBayWyo0GtKCMLp%2BeoCjWV%2Fxp8%2F4JA1MOM6VWDmLcyTcQ1P%2FKCPPCGHDkhOYTFngKaOHZ2CK1cDum8MPKyBcrBKNbL4bP68k07tATCSEimCaXFqC%2BsjOoOlfsGzAloFyuqX8MuehnQ5K5YDx%2BcolcKvN%2BoFrbBnBB8VmI9A6KgEJedh2iEn%2FXpSeh8s6j3CXm5487fxqkHhY8mifvWM18Yfw96uEsx85BL7J%2BuS190t17Nl7ivM%2FnQz9m0KEhSRh%2BUP73Bfo%2FkyOREPut3THuParKOsw%3D%3D--fgKIU3P2U8LleALC--xk3d6mc30OBcTees6dSShQ%3D%3D; _forum_session=cPn8DGuNovrhTDRqbC%2BjN18fIUjS4aW99ik0P4mdk47EyE0rjzIQXgvO%2FUZLd9tLtW4SmzPggnHwpCas0YebnkbgSX3BoFFw3WXuHmh9Q6jijxuTZhaRdKG%2Fbh8ObAOjsMU0fzJ0gIXPw2qrATorxreluW9LX%2Fk70bS23X12sMb58UUU2P9x1g7lpbIEXyOQu8Zt7vLaU1XgyqH%2B3WhBokcYJejy9x%2BhxM%2BBIR5eDSQRI08s3QDC4CaGZhYI7KIMQ9Z7R8%2BUqgOBENbr9pSYA9DtkxeQ%2FJdTbq5NmlAadgVqsFfvCbR87F2cO2lSX9R6jBmUysACnU8ABNg3h%2BFyH3bZxcwt2%2F07xIkDKwEtbdF3dptwC8L1x06WWMcSABdaEk82FjxL9t03WoDfVosuyxokIKxlA%2BczP30xF%2BBogI%2BKNRhAhab7aIlMJMd%2Fz2AvDH1bEot8eWFOMg%3D%3D--XxJ5u7YKaxAel70a--Hf1gi3RkRxCazJCNEDP8fQ%3D%3D; _ga_1X49KS6K0M=GS2.1.s1775349573$o17$g1$t1775352726$j41$l0$h1313667052; cf_clearance=kNDkHe82FBZTVBgJThyKJLX0ejVWgf9frmKU7VTC3qU-1775353589-1.2.1.1-mX9ZIQsaKt3lzKdUGpNXKf0i0BYxFhSpB.BJkNdh13oUm5655XreM5egSvl_M9M_TS4wCRlihMqnZ0k6qlF9E5C_ysrTASzK43GldmkBnxg2lHdXF3GatDwd1Y9haJ2TSEZ49MXaJBF7qw6FdV2RtftIpHaYbm4sHns0UQ6EDcUr3FKen5R1i_.gF2YXE9Ti1jvf9oq1hhd_Sa.iavNiriOpR3V5VuGFyxH16kBu0o9BUMTV7G6g3IG2M.CNtfRufTz68U00Bs4YIQ6jwWFpBFSz5nmRYmkGoESxjYaxLSks9Wqcf.toELzVaa1Q_Rb1DMLgL488SAtXzMy7jzu5uw`;

// Parse cookies
const cookies = [];
const pairs = cookieString.split(';').map(p => p.trim());

for (const pair of pairs) {
  const eqIndex = pair.indexOf('=');
  if (eqIndex > 0) {
    const name = pair.substring(0, eqIndex).trim();
    const value = pair.substring(eqIndex + 1).trim();
    cookies.push({
      name,
      value,
      domain: '.linux.do',
      path: '/',
      secure: true,
      httpOnly: name.startsWith('_')
    });
  }
}

// Create cookie data object
const cookieData = {
  url: 'https://linux.do',
  timestamp: new Date().toISOString(),
  cookies: cookies,
  important: {
    _t: cookies.find(c => c.name === '_t')?.value,
    _forum_session: cookies.find(c => c.name === '_forum_session')?.value,
    cf_clearance: cookies.find(c => c.name === 'cf_clearance')?.value
  }
};

// Save as JSON
fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-final.json', JSON.stringify(cookieData, null, 2));

// Save as Netscape format for curl/wget
const netscapeLines = ['# Netscape HTTP Cookie File'];
for (const c of cookies) {
  const domain = c.domain.startsWith('.') ? c.domain : '.' + c.domain;
  const expires = '0'; // Session cookie
  const secure = c.secure ? 'TRUE' : 'FALSE';
  netscapeLines.push(`${domain}\tTRUE\t${c.path}\t${secure}\t${expires}\t${c.name}\t${c.value}`);
}
fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies.txt', netscapeLines.join('\n'));

// Save as Playwright storage state
const storageState = {
  cookies: cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
    expires: -1,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: 'Lax'
  })),
  origins: []
};
fs.writeFileSync('C:/Users/Administrator/linuxdo-storage-state.json', JSON.stringify(storageState, null, 2));

console.log('✅ Cookie 解析完成！');
console.log('总 Cookie 数:', cookies.length);
console.log('\n关键 Cookie:');
console.log('- _t:', cookieData.important._t ? '✅ 已获取 (' + cookieData.important._t.slice(0, 30) + '...)' : '❌ 未找到');
console.log('- _forum_session:', cookieData.important._forum_session ? '✅ 已获取' : '❌ 未找到');
console.log('- cf_clearance:', cookieData.important.cf_clearance ? '✅ 已获取' : '❌ 未找到');
console.log('\n文件保存位置:');
console.log('- linuxdo-cookies-final.json (JSON格式)');
console.log('- linuxdo-cookies.txt (Netscape格式)');
console.log('- linuxdo-storage-state.json (Playwright格式)');
