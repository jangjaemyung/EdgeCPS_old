// req 정보를 xml에서 추출하기
function extractReq(){
	const inputString = window.localStorage.getItem(projectName+'_requirementsProcessXml')
	const pattern = /&lt;functional requirement&gt;&gt;&#10;([^<]+)" parent="1"/g;// functional req만 추출

	const matches = [...inputString.matchAll(pattern)];

	const resultArray = [];

	if (matches) {
		for (const match of matches) {
			var reqName = match[1];
			if(reqName.includes('['||']')){
				reqName = reqName.substring(1,reqName.length -1);
			}
			resultArray.push(reqName);

			// const endIndex = match.indexOf(">");
			// if (endIndex !== -1) {
			// 	resultArray.push(match.substring(0, endIndex + 1));
			// }
		}
	}
	console.log(resultArray);
	return resultArray;
	// const outputArray = resultArray.map(item => {
	// 	const labelMatch = item.match(/label="&lt;&lt;(.*?)&gt;&gt;"/);
	// 	const nameMatch = item.match(/name="(.*?)"/);
	// 	const idMatch = item.match(/id="(.*?)"/);
	// 	const textMatch = item.match(/text="(.*?)"/);
		
	// 	const label = labelMatch ? labelMatch[1] : "";
	// 	const name = nameMatch ? nameMatch[1] : "";
	// 	const id = idMatch ? idMatch[1] : "";
	// 	const text = textMatch ? textMatch[1] : "";
		
	// 	return [label, `name="${name}"`, `id="${id}"`, `text="${text}"`];
	//   });
	//   const finalArray = [];

	//   outputArray.forEach(item => {
	// 	finalArray.push(item);
	//   });
	//   return finalArray
}