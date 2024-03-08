<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detalle extends Model
{
    use HasFactory;
    
    protected $table = "detalle";
    protected $fillable = [
        'pedido',
        'codigo',
        'cantidad',
        'comentario',
       
    ];
    public $timestamps = false;

}


