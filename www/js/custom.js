// Initialize app
var app = new Framework7({
	root: '#app',
  // App id
  id: 'com.final.project',
			routes: [
				{
					path: '/home/',
					url: './index.html',
				},
				{
				  path: '/detail/',
				  templateUrl: './detail.html',
				},
			  ], 
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = app.views.create('.view-main', {
	pushState: false,
});

//mainView.router.back( mainView.router.previousRoute.url, {ignoreCache: true, preload: true, force: true});

function pushNotif(harga, isi){
    cordova.plugins.notification.local.schedule({
        title: "HARGA IGNIS NAIK!!!",
        text: isi + harga,
        foreground: true,
        vibrate: true
    });
 }

function onHome(){

	var form;
	$('.convert-form-to-data').click(function(){
		 form = $('form').serializeArray();
		pushNotif(form[0].value,form[1].value);
	})

	
}


$$(document).on('page:init', '.page[data-name="home"]', function (e) {
	onHome();
});

$$(document).on('page:init', '.page[data-name="detail"]', function (e) {

	var url="https://vip.bitcoin.co.id/api/ignis_idr/ticker";
	function keren(){
	$.getJSON(
			url, function(data){
				console.log(data);
				$.each(data, function(i,key){
					var date = new Date(key.server_time*1000);
					$("#infobtc").html(dataBTC(key))
					$("#date").html(date);
					var waktu = (date.getHours()+"-"+date.getMinutes());
					postData(key.last, key.buy,key.sell,key.high,key.low,key.vol_ignis,key.vol_idr);
					});
				window.setTimeout(keren, 5000);
			}
		)

		function postData(last, buy,sell,high,low,vol_ignis,vol_idr){
			var urlserver = "http://localhost/btc/koneksi/insert.php";
			$.post(urlserver, {last : last, buy : buy, sell : sell, high : high, low : low, volbtc : vol_ignis, volidr : vol_idr}, function(data){
				console.log("success");
			}, "json");
		}


		function dataBTC(key){
			return'Buy: '+ key.buy +'<br/>High: '+key.high+'<br/>Last: '+key.last+'<br/>Low: '+key.low+'<br/>Sell: '+key.sell+'<br/>Vol IDR: '+key.vol_idr+'<br/>Vol IGNIS: '+key.vol_ignis;
		}
	};

	keren();

	var lama;
	var baru;
	var cek = true;
	function notif(){
		var url="http://localhost/btc/koneksi/cekdata.php";
		$.getJSON(url, function(data){
			baru = data[0].ID;
				if (cek == true){
					lama = data[0].ID;
					cek = false;
				}

			}).done(function(hasil){
				if(baru > lama){
					pushNotif(hasil[0].lastbtc_idr,hasil[0].Keterangan);
					lama = baru;
					console.log("berhasil");
				}
			})
			window.setTimeout(notif, 2000);
			console.log("cek data");
		}

	notif();
});	