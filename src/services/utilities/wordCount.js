import striptags  from "striptags"


export const calculateReadTime =  (content)=>{
    const string = striptags(content)
    const totalWords = string.split(" ")
    const averageWordPerMinute = 120
    const totalMinute = totalWords.length/averageWordPerMinute
  
    return {
        value:parseInt(totalMinute),
        unit:"minutes"
    }
} 