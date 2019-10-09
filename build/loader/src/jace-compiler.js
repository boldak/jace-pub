
const lq = /(<<<[=,#]{0,1})/
const rq = /(>>>)/
const lqe = p => p == "<<<="
const lql = p => p == "<<<#"
const lqc = p => p == "<<<"
const rqe = p => p == ">>>"


module.exports = (source, options) => {
	
	let src = []
	source.split(lq).map( p => p.split(rq)).forEach(p => {
		src = src.concat(p)
	})

	let flag = null;
	let res = [];
	buf = []
	src.forEach( (p,index) => {
		
		if(lql(p)) {
			flag="log"
			buf.push('code.push( console.log("\\n"+eval(')
			return
		}

		if(lqe(p)) {
			flag="eval"
			buf.push('code.push( eval(')
			return
		}
		
		if(lqc(p)){
			flag="code"
			return
		}
		
		if(rqe(p)){
			
			if(flag == "eval") {
				buf.push('));\n')
				res.push(buf.join(""))
				buf = []
				flag = null
				return
			}

			if(flag == "log") {
				buf.push(')));\n')
				res.push(buf.join(""))
				buf = []
				flag = null
				return
			}

			flag = null
			return
		}


		if( flag == "code"){
			res.push(p)
			return
		}

		if( flag == "eval" || flag == "log"){
			buf.push(`context[${index}]`)
			return
		}

		if( !flag ){
			res.push(`code.push(context[${index}])`)
		}



	})


let result 
try {
	result = eval(`
	(context, options) => { 
		// console.log("context", context) 
		let code = []
		${res.join("\n")} 
		return code.join("")
	}
	`)(src, options)
} catch(e) {
	result = source
	console.log("Error", e.toString())
	console.log("=============================")
	console.log(source)
	console.log("=============================")
	console.log(res.join("\n"))
	console.log("=============================")
	 
}

return result


}

