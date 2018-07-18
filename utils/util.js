function formatTime(date,type) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if(type)
    
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  else
    return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 转换地址数据
 * */ 
function replacePhone(arr,isreplace){
  var newAddr =[]
  for(let i = 0 ; i < arr.length; i++){
    if(isreplace){
      let phone = arr[i].phone
      arr[i].phone = phone.replace(phone.substring(3,7),'****')
    }
    newAddr[i] = arr[i].name + ' ' + arr[i].phone + '\n' + arr[i].province + arr[i].city + arr[i].addr
  }
  
  return newAddr
}

function transLocalTime(t) {
  return new Date(t * 1000);
}


module.exports = {
  formatTime: formatTime,
  replacePhone : replacePhone,
  transLocalTime: transLocalTime
}
