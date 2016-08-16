/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * https://api.cartolafc.globo.com/atletas/mercado
 */

/* global _, o */

var express = require('express');
var router = express.Router();
var request = require('request');
var watson = require('watson-developer-cloud');
var extend = require('util')._extend;
var _ = require("lodash");




router.get('/loadcartola', function(req, res, next) {
    request({
        url: 'https://api.cartolafc.globo.com/atletas/mercado',
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            res.send(body);
            
        };
        if (error){
            throw error;
        }
    });
    
});

router.get('/loadcartola/:posicao', function(req, res, next) {
    try {
        var credentials = extend({
            username: '4692b0a4-ec12-446e-8077-311f1d88cbdb',
            password: 'pLn3I6WjgBu7',
            version: 'v1'         
        });
    }
    catch(err) {
        console.log("Erro ao obter Credentials do tradeoff_analytics: \n" + err.message);
    }


    try {
        var tradeoff_analytics = watson.tradeoff_analytics(credentials);
    }
    catch(err) {
        console.log("Erro ao autenticar no tradeoff_analytics: \n" + err.message);
    }
    
    var columns = getColumns();
    var lista = [];
    
    
    
    request({
        url: 'https://api.cartolafc.globo.com/atletas/mercado',
        json: true
    }, function (error, response, body) {

        if (error){
            throw error;
        }
        var players = [];
        
        for(i=0 ; i < body.atletas.length; i++){
            if(body.atletas[i].posicao_id === parseInt(req.params.posicao) && body.atletas[i].status_id===7){
                players.push({
                    key: body.atletas[i].atleta_id,
                    name: body.atletas[i].nome,
                    values: body.atletas[i]
                });
            }
         }
        
        var tradeoffDillema = {
            subject: "Cartola Watson",
            columns: columns,
            options: players
        };
        tradeoff_analytics.dilemmas(tradeoffDillema, function(err, result) {
                if (err)
                    console.log(err);
                
                for (x = 0; x < result.resolution.solutions.length; x++) {
                    if(result.resolution.solutions[x].status === "FRONT"){
                        var atleta = _.find(result.problem.options, o => o.key === result.resolution.solutions[x].solution_ref);
                        lista.push(atleta.values);
                        
                    }
                    
                }
                
                res.send({atletas:lista});
        });

    });
});


function getColumns(){
        return [
        {
            "key":"nome",
            "full_name":"nome",
            "type":"text",
            "is_objective":false
        },
        {
            "key":"preco_num",
            "full_name":"preco_num",
            "type":"numeric",
            "is_objective":true,
            "goal":"min"
        },
        {
            "key":"variacao_num",
            "full_name":"variacao_num",
            "type":"numeric",
            "is_objective":true,
            "goal":"min"
        },
        {
            "key":"jogos_num",
            "full_name":"jogos_num",
            "type":"numeric",
            "is_objective":true,
            "goal":"max"
        }
    ];
}

module.exports = router;