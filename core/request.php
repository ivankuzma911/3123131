<?php
class Request{
    public $mysqli;
    public $messages = array();
    public function __construct(){
        $this->mysqli = new mysqli('localhost', 'root', '', 'study');
        $this->parseUrl();
    }


    public function parseUrl(){
        if($_GET['action'] == 'getMessages'){
            $num = $_GET['num'];
            $result = $this->mysqli->query("SELECT * from chat ORDER BY id desc LIMIT ".$num);
            $this->fetchSql($result);
        }elseif($_GET['action'] == 'getMoreMessages'){
            $id = $_GET['prevId'];
            $result = $this->mysqli->query("SELECT * from chat where id < $id ORDER BY id desc LIMIT 5");
            $this->fetchSql($result);
        }elseif($_GET['action'] == 'getNewMessages'){
            $id = $_GET['lastId'];
            $result = $this->mysqli->query("SELECT * from chat where id > $id  ORDER BY id desc LIMIT 5");
           $this->fetchSql($result);
        }elseif($_GET['action']=='addNew') {
            $username = $_GET['username'];
            $text = $_GET['text'];
            $date = date('Y-m-d');
            $this->mysqli->query("INSERT into chat(username,text,created_on)VALUES('$username','$text','$date')");
        }
    }

    public function fetchSql($result){
        while($obj = $result->fetch_object()){
            $this->messages[] = (array)$obj;
        }
        echo json_encode($this->messages);
    }
}

$obj = new Request();








