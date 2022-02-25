document.querySelector("input[type='file']").addEventListener("change",function (){
    if (this.files){
        // @ts-ignore
        document.getElementById("image").src = URL.createObjectURL(this.files[0])
    }
})