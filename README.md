# README #

WebTalk to przykład bardzo prostej aplikacji internetowej, która do komunikacji używa web socket (https://en.wikipedia.org/wiki/WebSocket). Aplikacja umożliwia wysyłanie wiadomości tekstowych pomiędzy zalogowanymi użytkownikami, a więc przypomina tradycyjny internetowy czat. 

### Jak to działa? ###

Aplikacja składa się z dwóch części: serwerowej i klienckiej. Część serwerowa została zrealizowana w oparciu o serwer node.js, zaś część kliencka o framework angular.js jako jednostronicowa aplikacja. Oznacza to, że przy uruchomieniu aplikacji pobierane są wszystkie zależności, natomiast podczas późniejszego działania komunikacja z serwerem ogranicza się do wymiany danych związanych z przekazywaniem wiadomości pomiędzy użytkownikami. Dzięki takiemu podejściu użytkownik nie widzi efektu przeładowywania strony, a same zależności pobierane są tylko raz na początku podczas ładowania aplikacji. 

W aplikacji zastosowano nieco inne podejście od tradycyjnego w komunikacji klient - serwer. W tradycyjnym podejściu to klient odpytuje serwer o potrzebne dane w sposób asynchroniczny. W przypadku WebTalk zastosowano stosunkowo nowe podejście: web sockety. Oznacza to, że przy starcie aplikacji nawiązywane jest dodatkowe połączenie TCP, dzięki któremu komunikacja może odbywać się dwustronnie (serwer może sam wysłać dane do klienta). W porównaniu do tradycyjnego podejścia klient nie musi odpytywać serwera w regularnych odstępach czasu co oznacza znaczną oszczędność transferu danych oraz ograniczenie narzutu związanego z takim sposobem komunikacji.  

### Co WebTalk potrafi? ###

WebTalk umożliwia komunikację tekstową pomiędzy zalogowanymi użytkownikami z szczególnym uwzględnieniem możliwości:
* każdy użytkownik musi być zalogowany poprzez podanie unikalnej nazwy;
* aplikacja weryfikuje czy podana nazwa rzeczywiści jest unikalna;
* użytkownicy są informowani o zalogowaniu nowego użytkownika
* użytkownicy są informowani o wylogowaniu użytkownika
* użytkownicy mogą przeglądać wcześniejsze wiadomości z bieżącej sesji

### Przygotowanie środowiska do uruchomienia aplikacji ###
```bash
sudo apt-get install git nodejs-legacy npm
git clone https://bitbucket.org/dzbyrad/webtalk.git
cd webtalk
git checkout develop
git pull
npm install
node index.js
```

Aplikacja jest dostępna pod adresem http://host:3000:/?#/