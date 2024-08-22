var villes=[];
fetch('json/ville.json')
            .then(response => response.json())
            .then(data => {
                villes=data;
                var html='';
                villes.forEach(v => {
                    var option='<option value='+v['ville']+'>'+v['ville']+'</option>';
                    html +=option;
                });
                document.getElementById('ville').innerHTML=html;
            })

