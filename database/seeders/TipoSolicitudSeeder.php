<?php

namespace Database\Seeders;

use App\Models\TipoSolicitud;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipoSolicitudSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $elementos = [
            // Otros
            ["nombre" => "Facturas Compra", "tipo" => 0, "status" => 0],
            ["nombre" => "Facturas Venta", "tipo" => 0, "status" => 0],
            // Servicios
            ["nombre" => "Asesoria Financiera", "tipo" => 1, "status" => 1],
            ["nombre" => "Marketing Digital", "tipo" => 1, "status" => 1],
            ["nombre" => "Diseño de Marca Gráfica", "tipo" => 1, "status" => 1],
            ["nombre" => "Gestión Impositiva y Fiscal", "tipo" => 1, "status" => 1],
            ["nombre" => "Diseño de Página Web", "tipo" => 1, "status" => 1],
            ["nombre" => "Constitución Empresarial", "tipo" => 1, "status" => 1],
            ["nombre" => "Asesoria Comercial", "tipo" => 1, "status" => 1],
            ["nombre" => "Gestión de Financiamiento", "tipo" => 1, "status" => 1],
            // Certificaciones 
            ["nombre" => "Certificación de inscripción en DGII", "tipo" => 2, "status" => 1],
            ["nombre" => "Certificación de cumplimiento obligaciones tributarias", "tipo" => 2, "status" => 1],
            ["nombre" => "Certificación ministerio de trabajo", "tipo" => 2, "status" => 1],
            ["nombre" => "Certificación TSS", "tipo" => 2, "status" => 1],
            ["nombre" => "Certificación estatus jurídico", "tipo" => 2, "status" => 1],
            ["nombre" => "Certificación registro mercantil", "tipo" => 2, "status" => 1],
            // Estados Financieros
            ["nombre" => "Estado de resultado", "tipo" => 3, "status" => 1],
            ["nombre" => "Balance general", "tipo" => 3, "status" => 1],
            ["nombre" => "Estado de flujo de efectivo", "tipo" => 3, "status" => 1],
            ["nombre" => "Estado de capital", "tipo" => 3, "status" => 1],
            ["nombre" => "Estado comparativo", "tipo" => 3, "status" => 1],
            // Reportes Generales
            ["nombre" => "Reporte de ventas", "tipo" => 4, "status" => 1],
            ["nombre" => "Reporte de costos", "tipo" => 4, "status" => 1],
            ["nombre" => "Reporte de costos/ingresos", "tipo" => 4, "status" => 1],
            ["nombre" => "Balance de ITBIS", "tipo" => 4, "status" => 1],
            ["nombre" => "Liquidación aduanal", "tipo" => 4, "status" => 1],
           
        ];
        
       
        foreach ($elementos as $elemento) {
            TipoSolicitud::factory()->create($elemento);
        }
    }
}
