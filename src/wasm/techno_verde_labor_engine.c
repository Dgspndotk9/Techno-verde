/**
 * ============================================================================
 * TECHNO-VERDE S.A. - MOTOR LABORAL Y DE NÓMINA EN C (COMPILADO A WEBASSEMBLY)
 * ============================================================================
 * Empresa: Techno-Verde S.A. (Soluciones de Reciclaje Electrónico - RAEE)
 * Sucursales: Managua, Masaya, Carazo, Granada
 * Alianza Estratégica: Universidad Nacional Casimiro Sotelo Montenegro (UNCSM)
 * Marco Legal: República de Nicaragua
 *   - Código del Trabajo de Nicaragua (Ley No. 185)
 *   - Ley de Concertación Tributaria (Ley No. 822) y Reformas DGI
 *   - Ley de Seguridad Social (Decreto 975 y Reformas INSS)
 *   - Ley General de Higiene y Seguridad del Trabajo (Ley No. 618)
 * 
 * Compilación de destino: WebAssembly (Wasm) para ejecución directa en navegador
 * con latencia ultra-baja y precisión de punto flotante de 32/64 bits.
 * ============================================================================
 */

#ifndef TECHNO_VERDE_LABOR_ENGINE_H
#define TECHNO_VERDE_LABOR_ENGINE_H

#ifdef __cplusplus
extern "C" {
#endif

/* -------------------------------------------------------------------------- */
/* CONSTANTES LEGALES Y PARAMÉTRICAS DE NICARAGUA                             */
/* -------------------------------------------------------------------------- */

/* Tasas de Seguridad Social (INSS) */
#define INSS_LABORAL_TASA            0.0700f   /* 7.00% retención laboral obligatoria */
#define INSS_PATRONAL_TASA_GRANDE    0.2250f   /* 22.50% empresas > 50 colaboradores  */
#define INSS_PATRONAL_TASA_PEQUENA   0.2150f   /* 21.50% empresas <= 50 colaboradores */
#define INATEC_PATRONAL_TASA         0.0200f   /* 2.00% aporte técnico patronal       */

/* Jornadas Laborales (Ley 185, Arts. 51-53) */
#define HORAS_JORNADA_DIURNA         8.0f      /* 8 hrs diarias / 48 hrs semanales     */
#define HORAS_JORNADA_NOCTURNA       7.0f      /* 7 hrs diarias / 42 hrs semanales     */
#define HORAS_JORNADA_MIXTA          7.5f      /* 7.5 hrs diarias / 45 hrs semanales   */
#define RECARGO_HORA_EXTRA           2.0f      /* 100% de recargo sobre hora ordinaria */
#define DIAS_MES_COMERCIAL           30.0f
#define HORAS_MES_LABORAL            240.0f    /* 30 días x 8 horas                    */

/* Estratos de Retención IR Laboral Anual (Ley 822, Art. 23 - Nicaragua) */
#define IR_ESTRATO_1_LIMITE          100000.0f /* De C$ 0.01 a 100,000.00: 0%        */
#define IR_ESTRATO_2_LIMITE          200000.0f /* De C$ 100,000.01 a 200,000.00: 15% */
#define IR_ESTRATO_3_LIMITE          350000.0f /* De C$ 200,000.01 a 350,000.00: 20% */
#define IR_ESTRATO_4_LIMITE          500000.0f /* De C$ 350,000.01 a 500,000.00: 25% */
                                               /* Más de C$ 500,000.01: 30%           */

#define IR_BASE_ESTRATO_3            15000.0f  /* Impuesto base estrato 3             */
#define IR_BASE_ESTRATO_4            45000.0f  /* Impuesto base estrato 4             */
#define IR_BASE_ESTRATO_5            82500.0f  /* Impuesto base estrato 5             */

/* Parámetros de Vacaciones y Aguinaldo (Ley 185) */
#define DIAS_VACACIONES_POR_MES      2.5f      /* 15 días continuos por cada 6 meses  */
#define DIAS_AGUINALDO_POR_ANO       30.0f     /* 1 mes de salario por año laborado   */

/* -------------------------------------------------------------------------- */
/* ESTRUCTURAS DE DATOS DE C                                                  */
/* -------------------------------------------------------------------------- */

typedef struct {
    float salario_bruto;
    float horas_extras_monto;
    float bonos_raee;
    float otros_ingresos;
    float inss_laboral;
    float ir_laboral;
    float otras_deducciones;
    float salario_neto;
    float inss_patronal;
    float inatec_patronal;
    float costo_total_empleador;
} LiquidacionNominaC;

typedef struct {
    float indemnizacion_antiguedad; /* Art. 45 */
    float vacaciones_proporcionales;/* Art. 76 */
    float aguinaldo_proporcional;   /* Art. 93 */
    float total_liquidacion;
    float meses_efectivos;
} FiniquitoLaboralC;

/* -------------------------------------------------------------------------- */
/* FUNCIONES EXPORTABLES A WEBASSEMBLY (WASM_EXPORT)                          */
/* -------------------------------------------------------------------------- */

#if defined(__EMSCRIPTEN__) || defined(__wasm__)
#define WASM_EXPORT __attribute__((visibility("default")))
#else
#define WASM_EXPORT
#endif

/**
 * 1. Calcula la deducción del INSS Laboral (7.00%)
 * Conforme a las reformas actuales a la Ley de Seguridad Social, sin techo salarial.
 */
WASM_EXPORT
float calcular_inss_laboral(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    return salario_bruto * INSS_LABORAL_TASA;
}

/**
 * 2. Calcula el aporte del INSS Patronal
 * 22.50% para empresas de más de 50 colaboradores (Techno-Verde S.A. en sus 4 sucursales)
 * 21.50% si el conteo es menor o igual a 50.
 */
WASM_EXPORT
float calcular_inss_patronal(float salario_bruto, int total_trabajadores) {
    if (salario_bruto <= 0.0f) return 0.0f;
    float tasa = (total_trabajadores > 50) ? INSS_PATRONAL_TASA_GRANDE : INSS_PATRONAL_TASA_PEQUENA;
    return salario_bruto * tasa;
}

/**
 * 3. Calcula el aporte al INATEC (2.00% Patronal)
 */
WASM_EXPORT
float calcular_inatec(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    return salario_bruto * INATEC_PATRONAL_TASA;
}

/**
 * 4. Calcula la retención mensual del Impuesto sobre la Renta (IR)
 * según la Ley de Concertación Tributaria de Nicaragua (Ley 822, Art. 23)
 * Pasos:
 *   a) Ingreso neto mensual gravable = Salario bruto - INSS laboral
 *   b) Proyección anual = Ingreso gravable mensual * 12
 *   c) Aplicar tabla progresiva DGI
 *   d) Retención mensual = IR anual / 12
 */
WASM_EXPORT
float calcular_ir_mensual(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    
    float inss = calcular_inss_laboral(salario_bruto);
    float gravable_mensual = salario_bruto - inss;
    float gravable_anual = gravable_mensual * 12.0f;
    float ir_anual = 0.0f;

    if (gravable_anual <= IR_ESTRATO_1_LIMITE) {
        /* Hasta C$ 100,000.00: Exento */
        ir_anual = 0.0f;
    } else if (gravable_anual <= IR_ESTRATO_2_LIMITE) {
        /* De C$ 100,000.01 a C$ 200,000.00: 15% sobre el exceso de C$ 100,000 */
        ir_anual = (gravable_anual - IR_ESTRATO_1_LIMITE) * 0.15f;
    } else if (gravable_anual <= IR_ESTRATO_3_LIMITE) {
        /* De C$ 200,000.01 a C$ 350,000.00: C$ 15,000 + 20% sobre el exceso de C$ 200,000 */
        ir_anual = IR_BASE_ESTRATO_3 + ((gravable_anual - IR_ESTRATO_2_LIMITE) * 0.20f);
    } else if (gravable_anual <= IR_ESTRATO_4_LIMITE) {
        /* De C$ 350,000.01 a C$ 500,000.00: C$ 45,000 + 25% sobre el exceso de C$ 350,000 */
        ir_anual = IR_BASE_ESTRATO_4 + ((gravable_anual - IR_ESTRATO_3_LIMITE) * 0.25f);
    } else {
        /* Más de C$ 500,000.01: C$ 82,500 + 30% sobre el exceso de C$ 500,000 */
        ir_anual = IR_BASE_ESTRATO_5 + ((gravable_anual - IR_ESTRATO_4_LIMITE) * 0.30f);
    }

    return ir_anual / 12.0f;
}

/**
 * 5. Pago de Horas Extras según Arts. 56 y 62 del Código del Trabajo
 * Valor de hora ordinaria = Salario mensual / 240 horas
 * Hora extraordinaria = Valor hora ordinaria * 2.0 (recargo 100%)
 */
WASM_EXPORT
float calcular_pago_horas_extras(float salario_mensual, float horas_extras, int es_nocturno_o_feriado) {
    if (salario_mensual <= 0.0f || horas_extras <= 0.0f) return 0.0f;
    float valor_hora_ordinaria = salario_mensual / HORAS_MES_LABORAL;
    float factor = es_nocturno_o_feriado ? 2.5f : RECARGO_HORA_EXTRA;
    return valor_hora_ordinaria * factor * horas_extras;
}

/**
 * 6. Bono de Higiene, Seguridad y Riesgo RAEE (Ley 618)
 * Bonificación técnica para operarios expuestos a desensamble de placas,
 * recuperación química en Carazo, o manejo de tubos CRT y litio.
 */
WASM_EXPORT
float calcular_bono_riesgo_raee(int nivel_riesgo, float kilos_procesados) {
    /* Nivel 1: Administrativo / Logístico (Granada/Managua Central) = 0 */
    /* Nivel 2: Desensamble Mecánico RAEE (Masaya/Managua Planta) = C$ 800 + 0.02 C$/kg */
    /* Nivel 3: Hidrometalurgia y Químicos (Carazo Jinotepe) = C$ 1,500 + 0.04 C$/kg */
    if (nivel_riesgo == 2) {
        return 800.0f + (kilos_procesados * 0.02f);
    } else if (nivel_riesgo == 3) {
        return 1500.0f + (kilos_procesados * 0.04f);
    }
    return 0.0f;
}

/**
 * 7. Estipendio de Transporte y Alimentación para Pasantes UNCSM
 * Conforme al Convenio Marco UNCSM - Techno-Verde S.A.
 * Los pasantes no tienen deducción de INSS ni IR (estatuto de práctica formativa).
 */
WASM_EXPORT
float calcular_estipendio_uncsm(int horas_semanales, int nivel_carrera) {
    /* nivel 1: 3er-4to año (C$ 120 por día hábil de práctica) */
    /* nivel 2: Egresado / Año de Tesis RAEE (C$ 180 por día hábil) */
    float factor_diario = (nivel_carrera >= 2) ? 180.0f : 120.0f;
    float dias_semana = (float)horas_semanales / 8.0f;
    if (dias_semana > 5.0f) dias_semana = 5.0f;
    return dias_semana * 4.33f * factor_diario;
}

/**
 * 8. Cálculo de Indemnización por Antigüedad (Art. 45 del Código del Trabajo)
 * - 1 mes de salario por cada uno de los primeros 3 años trabajados.
 * - 20 días de salario por cada año adicional a partir del cuarto año.
 * - Tope máximo legal: 5 meses de salario.
 * - Las fracciones de año se pagan proporcionalmente.
 */
WASM_EXPORT
float calcular_indemnizacion_art45(float salario_mensual, float anos_laborados) {
    if (salario_mensual <= 0.0f || anos_laborados <= 0.0f) return 0.0f;

    float meses_indemnizacion = 0.0f;

    if (anos_laborados <= 3.0f) {
        meses_indemnizacion = anos_laborados * 1.0f;
    } else {
        /* Primeros 3 años = 3 meses */
        meses_indemnizacion = 3.0f;
        float anos_adicionales = anos_laborados - 3.0f;
        /* 20 días por año = 20/30 = 2/3 de mes por año */
        meses_indemnizacion += anos_adicionales * (20.0f / 30.0f);
    }

    /* Tope máximo legal de 5 meses */
    if (meses_indemnizacion > 5.0f) {
        meses_indemnizacion = 5.0f;
    }

    return meses_indemnizacion * salario_mensual;
}

/**
 * 9. Cálculo de Décimo Tercer Mes / Aguinaldo (Art. 93 Ley 185)
 * Período computable: 1 dic al 30 nov.
 * Un mes de salario ordinario por un año continuo o proporcional a los días laborados.
 * Totalmente exento de deducciones (sin INSS ni IR, inembargable).
 */
WASM_EXPORT
float calcular_aguinaldo_proporcional(float salario_mensual, int dias_en_periodo) {
    if (salario_mensual <= 0.0f || dias_en_periodo <= 0) return 0.0f;
    if (dias_en_periodo >= 360) return salario_mensual;
    return (salario_mensual / 360.0f) * (float)dias_en_periodo;
}

/**
 * 10. Cálculo de Vacaciones Proporcionales No Gozadas (Art. 76 Ley 185)
 * 15 días continuos de descanso remunerado por cada 6 meses (2.5 días por mes).
 * Salario diario = Salario mensual / 30 días.
 */
WASM_EXPORT
float calcular_vacaciones_remuneradas(float salario_mensual, float dias_acumulados_pendientes) {
    if (salario_mensual <= 0.0f || dias_acumulados_pendientes <= 0.0f) return 0.0f;
    float salario_diario = salario_mensual / DIAS_MES_COMERCIAL;
    return salario_diario * dias_acumulados_pendientes;
}

/**
 * 11. Resumen Completo de Salario Neto
 */
WASM_EXPORT
float calcular_salario_neto_mensual(float salario_bruto, float horas_extras, float bono_raee, float deducciones_personales) {
    float total_ingresos = salario_bruto + horas_extras + bono_raee;
    float inss = calcular_inss_laboral(total_ingresos);
    float ir = calcular_ir_mensual(total_ingresos);
    float total_deducciones = inss + ir + deducciones_personales;
    float neto = total_ingresos - total_deducciones;
    return (neto > 0.0f) ? neto : 0.0f;
}

#ifdef __cplusplus
}
#endif

#endif /* TECHNO_VERDE_LABOR_ENGINE_H */
