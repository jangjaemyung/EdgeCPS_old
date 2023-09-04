// req 정보를 xml에서 추출하기
function extractReq(){
	const inputString = window.localStorage.getItem(projectName+'_requirementsProcessXml')
	// var startIndex = inputString.indexOf("functional requirement");
	// if (startIndex !== -1) {
	// const leftBracketIndex = inputString.lastIndexOf("<", startIndex);
	// const rightBracketIndex = inputString.indexOf(">", startIndex);

	// if (leftBracketIndex !== -1 && rightBracketIndex !== -1 && leftBracketIndex < rightBracketIndex) {
	// 	var extractedText = inputString.substring(leftBracketIndex + 1, rightBracketIndex);
	// 	console.log(extractedText);
	// 	}
	// }
	const pattern = /<object label="&lt;&lt;(functional|non functional) requirement&gt;&gt;".*?>/g;

	const matches = inputString.match(pattern);

	const resultArray = [];

	if (matches) {
		for (const match of matches) {
			const endIndex = match.indexOf(">");
			if (endIndex !== -1) {
				resultArray.push(match.substring(0, endIndex + 1));
			}
		}
	}
	console.log(resultArray);

	// var reqArray = []
	// for (i=0 ; i<resultArray.length; i++){
	// 	var string = resultArray[i]
	// 	const openingTag = '&lt;&lt;';
	// 	const closingTag = '&gt;&gt;';


	// 	const startIndex = string.indexOf(openingTag) + openingTag.length;
	// 	const endIndex = string.indexOf(closingTag);

	// 	if (startIndex !== -1 && endIndex !== -1) {
	// 	const capturedText = string.substring(startIndex, endIndex);

	// 	const remainingText = string.substring(endIndex + closingTag.length);
	// 	const attributeArray = remainingText.split(' ').filter(attribute => attribute !== '');;

	// 	const resultArray = [capturedText, ...attributeArray];
	// 	const indexToRemove = resultArray.indexOf('"');
	// 	if (indexToRemove !== -1) {
	// 		resultArray.splice(indexToRemove, 1);
	// 	}
	// 	console.log(resultArray);
	// 	reqArray.push(resultArray);
		
	// 	}
	// }

	const outputArray = resultArray.map(item => {
		const labelMatch = item.match(/label="&lt;&lt;(.*?)&gt;&gt;"/);
		const nameMatch = item.match(/name="(.*?)"/);
		const idMatch = item.match(/id="(.*?)"/);
		const textMatch = item.match(/text="(.*?)"/);
		
		const label = labelMatch ? labelMatch[1] : "";
		const name = nameMatch ? nameMatch[1] : "";
		const id = idMatch ? idMatch[1] : "";
		const text = textMatch ? textMatch[1] : "";
		
		return [label, `name="${name}"`, `id="${id}"`, `text="${text}"`];
	  });
	  const finalArray = [];

	  outputArray.forEach(item => {
		finalArray.push(item);
	  });
	  return finalArray
}