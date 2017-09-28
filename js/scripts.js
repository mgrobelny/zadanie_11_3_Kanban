// scripts.js

// instrukcja, która sprawi, że kod aplikacji zacznie się wczytywać dopiero po załadowaniu całego drzewa DOM
$(function() {

// tablica - najwyższy obiekt w hierarchii
    var table = {
        name: 'project', // nazwa tablicy (atrybut)
        element: $('div') // element DOM
    };

    // kolumna - jest częścią tablicy i to w niej są karteczki; metody kolumny to usunięcie kolumny oraz stworzenie nowej karteczki w danej kolumnie
    var column = {
        id: '12j82da20k', 
        name: 'todo', // nazwa kolumny (atrybut)
        element: $('.column') // element DOM
    };

    // karteczka - najprostszy element tablicy; czynnościami (metodami), które karteczka możę wykonać, są usunięcie oraz przeniesienie jej do innej kolumny
    var card = {
        id: '2kd8s958ka',
        description: 'Create Kanban app', // opis zadania
        color: 'green', // kolor
        element: $('.card') // element DOM
    };

    // funkcja generująca unikalny id dla kolumny oraz karteczki (co zapobiega tworzeniu duplikatów)
    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)]; // funkcja losuje 10 elementów z tablicy znaków chars i składa je w jeden string
        }
    return str;
    }

    // klasa Column 
    function Column(name) {
        var self = this; // useful for nested functions

    this.id = randomString(); // id generowany za pomocą wcześniej utworzonej funkcji randomString()
    this.name = name;
    this.$element = createColumn();

    	// tworzenie elementów kolumny
        function createColumn() {
            var $column = $('<div>').addClass('column'); // poniżej elementy, z których składa się kolumna:
                var $columnTitle = $('<h2>').addClass('column-title').text(self.name); // tytuł kolumny; wypełniony tekstem za pomocą metody text()
                var $columnCardList = $('<ul>').addClass('column-card-list'); // lista karteczek
                var $columnDelete = $('<button>').addClass('btn-delete').text('x'); // przycisk do kasowania ("x")
                var $columnAddCard = $('<button>').addClass('add-card').text('Add a card'); // przycisk "dodaj kartę"
    			
    			// Podpinanie zdarzeń
    			// Dodajemy nasłuchwanie zdarzeń:
                $columnDelete.click(function() { // kasowanie kolumny po kliknięciu w przycisk
                self.removeColumn();
                });
        
                // dodawanie karteczki po kliknięciu w przycisk
                $columnAddCard.click(function() {
                self.addCard(new Card(prompt("Enter the name of the card"))); // funkcja prompt() - pobranie od użytkownika nazwy kolumny, którą chcemy stworzyć
                });

                // konstruowanie elementów kolumny
                $column.append($columnTitle).append($columnDelete).append($columnAddCard).append($columnCardList);
                // zwrócenie elementu kolumny
                return $column;
    }
    }

    // dodanie dwóch metod do protoypu klasy Column - dodanie karty i dodanie funkcji
    Column.prototype = {
    addCard: function(card) { // metoda przyjmuje jako parametr kartę, którą chcemy dodać do kolumny
            this.$element.children('ul').append(card.$element); // pobranie za pomocą jQuery wszystkich dzieci ul kolumny, a następnie podpięcie karty
    },
    removeColumn: function() { // usunięcie kolumny po naciśnięciu na przycisk "X"
            this.$element.remove();
    }
    };

    // funkcja konstruująca klasę Card
    function Card(description) {
            var self = this;
            this.id = randomString(); // id generowany przy użyciu funkcji ramdonString()
            this.description = description;
            this.$element = createCard(); // przechowuje element DOM, który tworzy nam ta funkcja
            
            // funkcja odpowiedzialna za tworzenie karteczki
            function createCard() {
            // tworzenie elementów, z których będzie składała się karta
                    var $card = $('<li>').addClass('card'); // tworzenie elementu listy, czyli sama karta
                    var $cardDescription = $('<p>').addClass('card-description').text(self.description); // tworzenie opisu karty w paragrafie
                    var $cardDelete = $('<button>').addClass('btn-delete').text('x'); // tworzenie przycisku do usuwania karty
           
           // wywołanie na kliknięcie metody removeCard(), usuwającej kartę
                    $cardDelete.click(function(){
                    self.removeCard();
                    });
            
            // składanie i zwracanie karty
                    $card.append($cardDelete).append($cardDescription);
                    return $card;
            }
    }
    // metoda dla klasy Card
    Card.prototype = {
            removeCard: function() { // jedyna metoda, którą musimy zaimplementować w przypadku karty jest jej usunięcie
                this.$element.remove();
            }
    };

    // obiekt tablicy (nie było sensu tworzyć klasę dla tablicy, gdyż będzie tylko jeden taki obiekt)
    var board = {
    name: 'Kanban Board',
    // dodawanie kolumny do tablicy - tworzenie kolumny dzięki przypięciu jej do elementu tablicy
    addColumn: function(column) {
        this.$element.append(column.$element); // this.$element wskazuje na board.$element
        initSortable();
    },
    $element: $('#board .column-container') // selektor umożliwiający znalezienie poprawnego kontenera tablicy
    };

    // metoda sortable, dzięki której możemy sortować elementy listy poprzez przeciągnij&upuść; działa dzięki rozszerzeniu jQueryUI
    function initSortable() {
    $('.column-card-list').sortable({ // wybór za pomocą selektora wszystkich list kart, które mają być przenoszone; potem dodanie funkcjonalności sortowania jQueryUI - sortable()
        connectWith: '.column-card-list', // atrybut, dzięki któremu możemy wybrać listę, w której będzie działac sortowanie
        placeholder: 'card-placeholder' // trzyma nazwę klasy, która pojawia się po najechaniu na puste pole, na które chcemy upuścić przenoszony element
    }).disableSelection(); // wyłączenie zaznaczania tekstu na przeciąganych kartach
    }

    // podpięcie zdarzenia naciśnięcia przycisku służącego do dodawania kolejnych kolumn
    $('.create-column').click(function(){
        var name = prompt('Enter a column name'); // komunikat prosi o nazwę nowej kolumny
        var column = new Column(name); // wrzucenie nowej kolumny do tablicy (nowa instancja)
    board.addColumn(column); // funkcja tworzy na tablicy nową kolumnę
    });

    // TWORZENIE KOLUMN
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');

    // DODAWANIE KOLUMN DO TABLICY
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // TWORZENIE NOWYCH EGZEMPLARZY KART
    var card1 = new Card('New task');
    var card2 = new Card('Create kanban boards');

    // DODAWANIE KART DO KOLUMN
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);
    });