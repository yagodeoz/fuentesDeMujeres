//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the TasksServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TasksServiceProvider {

  db: SQLiteObject = null;

  //Nombres Tablas
  public TABLA_COBPARAMETROS = "COBPARAMETROS";
  public TABLA_COBUSUARIOS   = "COBUSUARIOS";
  public TABLA_COBCARTERACAB = "COBCARTERACAB";
  public TABLA_COBCARTERADET = "COBCARTERADET";
  public TABLA_COBRECIBOCAB  = "COBRECIBOCAB";
  public TABLA_COBCIERRE     = "COBCIERRE";
  
  //Creacion Tablas
  public SQL_COBPARAMETROS  = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBPARAMETROS+'('
                          +'CODPARAMETRO TEXT PRIMARY KEY, '
                          +'VALOR TEXT NOT NULL)';

  public SQL_COBUSUARIOS = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBUSUARIOS+'('
                          +'CODUSUARIO TEXT PRIMARY KEY, '
                          +'NOMBRE TEXT, '
                          +'CLAVE TEXT, '
                          +'CLIENTESTODOS TEXT, '
                          +'ULTIMAACTUALIZACION TEXT)';

 public SQL_COBCARTERACAB = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBCARTERACAB+'('
                          +'CODEMPRESA TEXT, '
                          +'CODCLIENTE TEXT, '
                          +'NOMBRECLIENTE TEXT, ' 
                          +'EMAILCLIENTE TEXT, ' 
                          +'CODIGOVENDEDOR TEXT, '
                          +'USUARIOVENDEDOR TEXT, '
                          +'VENCIDO TEXT, '
                          +'XVENCER TEXT, '
                          +'AFAVOR TEXT, '
                          +'TOTAL TEXT)';

  public SQL_COBCARTERADET = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBCARTERADET+'('
                          +'CODEMPRESA TEXT, '
                          +'CODCLIENTE TEXT, '
                          +'REFERENCIA TEXT,  '
                          +'VENDEDOR TEXT,  '
                          +'NUMCUOTA TEXT, '
                          +'NUMDOCUMENTO TEXT, '                          
                          +'FECHAEMISION TEXT, '
                          +'DIASFEMISION TEXT, '
                          +'VALORCUOTA TEXT, ' 
                          +'VALORCHEQUE TEXT, '
                          +'VALORSALDO TEXT, '
                          +'ORDENAMIENTO INTEGER, '
                          +'VALORXAPLICAR TEXT)';

  public SQL_COBRECIBOCAB = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBRECIBOCAB+'('
                           +'CODEMPRESA TEXT, '
                           +'IDRECIBO TEXT,  '
                           +'FECHA TEXT, '
                           +'CODUSUARIO TEXT, '
                           +'CODCLIENTE TEXT, '
                           +'NOMBRECLIENTE TEXT, '
                           +'VALORPAGO TEXT, '
                           +'DETALLESPAGO TEXT, '
                           +'DETALLESDOCU TEXT, '
                           +'CODESTADO TEXT)';

  public SQL_COBCIERRE = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBCIERRE+'('
                           +'CODEMPRESA TEXT, '
                           +'IDCIERRE TEXT,  '
                           +'BANCO INTEGER,  '
                           +'NUMDEPOSITO TEXT, '
                           +'VALOR TEXT, '
                           +'DETALLECIERRE TEXT)';


  constructor() {}

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  //CREACION DE TABLAS BASE DE DATOS 
  inicializarBaseDatos(){

    //Creacion de tablas
    this.crearTabla(this.TABLA_COBPARAMETROS);
    this.crearTabla(this.TABLA_COBUSUARIOS);
    this.crearTabla(this.TABLA_COBCARTERACAB);
    this.crearTabla(this.TABLA_COBCARTERADET);
    this.crearTabla(this.TABLA_COBRECIBOCAB);
    this.crearTabla(this.TABLA_COBCIERRE);

    //Retorno al final de las ejecuciones
    return true;

  }

  /*
  create(task: any){
    let sql = 'INSERT INTO tasks(title, completed) VALUES(?,?)';
    return this.db.executeSql(sql, [task.title, task.completed]);
  }

  delete(task: any){
    let sql = 'DELETE FROM tasks WHERE id=?';
    return this.db.executeSql(sql, [task.id]);
  } 

  getAll(){
    let sql = 'SELECT * FROM tasks';
    return this.db.executeSql(sql, [])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  } 
  */

 

  //IFLORES - ingresa los Resgitros a la tabla descrita
  insertarRegistros(tabla:string, registro: any){
    
    let sql = 'INSERT OR REPLACE INTO [TABLA]([CAMPOS]) VALUES([VALORES])';
    let valores = null;

    //Tabla COBPARAMETROS
    if(this.TABLA_COBPARAMETROS == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBPARAMETROS);
      sql = sql.replace('[CAMPOS]',"CODPARAMETRO, VALOR");
      sql = sql.replace('[VALORES]',"?,?");

      console.log("sql ==> "+sql);
      valores = [registro.CODPARAMETRO, registro.VALOR];
    }

    //Tabla COBUSUARIOS
    if(this.TABLA_COBUSUARIOS == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBUSUARIOS);
      sql = sql.replace('[CAMPOS]',"CODUSUARIO, NOMBRE, CLAVE, CLIENTESTODOS, ULTIMAACTUALIZACION");
      sql = sql.replace('[VALORES]',"?,?,?,?,?");

      console.log("sql ==> "+sql);
      valores = [registro.CODUSUARIO, 
                 registro.NOMBRE,
                 registro.CLAVE,
                 registro.CLIENTESTODOS,
                 registro.ULTIMAACTUALIZACION];
    }

    //Tabla COBCARTERA CABECERA
    if(this.TABLA_COBCARTERACAB == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBCARTERACAB);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, NOMBRECLIENTE, EMAILCLIENTE, CODIGOVENDEDOR, "+
                                   "USUARIOVENDEDOR, VENCIDO, XVENCER, AFAVOR, TOTAL");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?");

      valores = [registro.CODEMPRESA, 
                 registro.CODCLIENTE,
                 registro.NOMBRECLIENTE,
                 registro.EMAILCLIENTE,
                 registro.CODIGOVENDEDOR, 
                 registro.USUARIOVENDEDOR,
                 registro.VENCIDO,
                 registro.XVENCER,
                 registro.AFAVOR,
                 registro.TOTAL];
    }

    //Tabla COBCARTERA DETALLE
    if(this.TABLA_COBCARTERADET == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBCARTERADET);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, REFERENCIA, NUMCUOTA, "+
                                   "NUMDOCUMENTO, FECHAEMISION, DIASFEMISION, VALORCUOTA, "+
                                   "VALORCHEQUE, VALORSALDO, ORDENAMIENTO, VALORXAPLICAR ");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?,?,?");

      valores = [registro.CODEMPRESA, 
                 registro.CODCLIENTE,
                 registro.REFERENCIA,
                 registro.NUMCUOTA,
                 registro.NUMDOCUMENTO,
                 registro.FECHAEMISION, 
                 registro.DIASFEMISION,
                 registro.VALORCUOTA, 
                 registro.VALORCHEQUE,
                 registro.VALORSALDO,
                 registro.ORDENAMIENTO,
                 registro.VALORXAPLICAR];
    }

    //Tabla COBRECIBOCAB
    if(this.TABLA_COBRECIBOCAB == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBRECIBOCAB);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA, IDRECIBO, FECHA, CODUSUARIO, CODCLIENTE, NOMBRECLIENTE,"+
                                   "VALORPAGO, DETALLESPAGO, DETALLESDOCU, CODESTADO");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?");
      valores = [registro.CODEMPRESA, 
                 registro.IDRECIBO,
                 registro.FECHA,
                 registro.CODUSUARIO,
                 registro.CODCLIENTE,
                 registro.NOMBRECLIENTE,
                 registro.VALORPAGO,
                 registro.DETALLESPAGO,
                 registro.DETALLESDOCU,
                 registro.CODESTADO];
    }

    //Tabla COBCIERRE
    if(this.TABLA_COBCIERRE == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_COBCIERRE);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA, IDCIERRE, BANCO, NUMDEPOSITO, VALOR, DETALLECIERRE");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?");
      valores = [registro.CODEMPRESA, 
                 registro.IDCIERRE,
                 registro.BANCO,
                 registro.NUMDEPOSITO,
                 registro.VALOR,
                 registro.DETALLECIERRE];
    }

    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, valores);   
  }


  //Iflores - Verifica Usuario Base Datos
  verificaAccesoUsuario(usuario:string, clave:string, fechaActual:string){
    let sql = "SELECT * FROM "+this.TABLA_COBUSUARIOS+" WHERE CODUSUARIO=? AND CLAVE=? "+
              "AND ULTIMAACTUALIZACION LIKE  '"+ fechaActual +"%'";
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, [usuario.toLowerCase(), clave])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }

  /******************** BLOQUE TABLAS *****************************/
  /****************************************************************/

  //Iflores - Eliminar tabla
  crearTabla(tabla:string){

    let sql = "";
    
    if(this.TABLA_COBPARAMETROS== tabla){
      sql = this.SQL_COBPARAMETROS;
    }


    if(this.TABLA_COBUSUARIOS == tabla){
      sql = this.SQL_COBUSUARIOS;
    }

    //Tabla COBCARTERA CABECERA
    if(this.TABLA_COBCARTERACAB == tabla){
      sql = this.SQL_COBCARTERACAB;
    }

    //Tabla COBCARTERA DETALLES
    if(this.TABLA_COBCARTERADET == tabla){
      sql = this.SQL_COBCARTERADET;
    }

    //Tabla COBRECIBOCAB
    if(this.TABLA_COBRECIBOCAB == tabla){
      sql = this.SQL_COBRECIBOCAB;
    }

    //Tabla COBCIERRE
    if(this.TABLA_COBCIERRE == tabla){
      sql = this.SQL_COBCIERRE;
    }
  
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql,[]);   
  }

   //Iflores - Eliminar tabla
   eliminarTabla(tabla:string){
    //Elimina Tabla
    let sql = 'DROP TABLE IF EXISTS '+tabla;
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql,[]);   
  }

  //Iflores - Limpiar tabla
  encerarTabla(tabla:string){
    let sql = 'DELETE FROM '+tabla;
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql,[]);   
  }

  //Iflores - Actualizar Usuario Conexion
  updateUsuario(registro: any){
    let sql = "UPDATE "+this.TABLA_COBUSUARIOS+" SET ULTIMAACTUALIZACION = ?, CLIENTESTODOS = ? WHERE CODUSUARIO = '"+registro.CODUSUARIO+"'";
    console.log("sql ==> "+sql);
    console.log("registro.EMPRESAS ==> "+registro.EMPRESAS);
    return this.db.executeSql(sql, [registro.ULTIMAACTUALIZACION, registro.EMPRESAS]);
  } 

  //Iflores - Obtener Parametro del Sistema
  obtenerParametro(codigoParametro:string){
    let sql = " SELECT * FROM "+this.TABLA_COBPARAMETROS
             +" WHERE CODPARAMETRO = '"+codigoParametro+"'";
             //+" LIMIT 1 ";

    console.log("obtenerParametro ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
        console.log("repuesta ==> " + JSON.stringify(registros));
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }

  //Iflores - Query Cartera Principal
  obtenerCarteraClientes(filtros:any){
    let sql = " SELECT * FROM "+this.TABLA_COBCARTERACAB
             +" where codempresa = "+filtros.empresa
             +" and codcliente||nombrecliente like '%"+filtros.cliente+"%' "
             +" LIMIT 50 ";

    console.log("obtenerCarteraClientes ==> "+sql);

    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }

  //Iflores - Query Cartera Saldos x Cliente
  obtenerEstadoCuentaXCliente(filtros:any){
    let sql =  " SELECT D.*, 'N' AS BLOQUEADO FROM "+this.TABLA_COBCARTERADET+" D"
              +" WHERE D.CODEMPRESA = "+filtros.empresa
              +" AND D.CODCLIENTE = "+filtros.cliente;
    
    if(filtros.soloFacturas != undefined && filtros.soloFacturas == 'S'){
      sql = sql +" AND (D.REFERENCIA LIKE '%FAC%' "
                +"      OR D.REFERENCIA LIKE '%VTAIN%' "
                +"      OR D.REFERENCIA LIKE '%NDCLI%' "
                +"      OR D.REFERENCIA LIKE '%RCING%') ";
    }

    //Ordenamiento
    sql = sql +" ORDER BY D.ORDENAMIENTO ASC ";

    console.log("obtenerEstadoCuentaXCliente ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }
  /****************************************************************/
  /****************************************************************/

  //Obtener Secuencia Maxima Recibo Cobros
  obtenerSecuenciaRecibo(empresa, fechaActual, usuario){
    let sql = "SELECT IFNULL(CAST(TRIM(SUBSTR(CB.IDRECIBO,14, LENGTH(CB.IDRECIBO))) AS INTEGER) ,0) + 1  AS SECUENCIA  "+
              "  FROM "+this.TABLA_COBRECIBOCAB+" CB"+
              " WHERE CB.FECHA = '"+fechaActual+"'"+
              "   AND CB.CODEMPRESA = '"+empresa+"'"+
              "   AND CB.CODUSUARIO = '"+usuario+"'"+
              "   AND (CB.CODESTADO <> 'ANULADO' AND CB.CODESTADO <> 'ACTIVO')"+
              " ORDER BY IFNULL(CAST(TRIM(SUBSTR(CB.IDRECIBO,14, LENGTH(CB.IDRECIBO))) AS INTEGER) ,0)  DESC, "+
              "          CB.ROWID DESC LIMIT 1 ";

    console.log("obtenerSecuenciaRecibo ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }

  //Obtener Recibos Cobros
  obtenerRecibosCobros(empresa:string, fdesde:string, fhasta:string, codigoUsuario:string){

    let sql = " SELECT CAST(CB.ROWID AS TEXT) AS ID, "+
              "   CB.CODEMPRESA, "+
              "   CB.IDRECIBO, "+
              "   CB.FECHA, "+
              "   CB.CODUSUARIO, "+
              "   CB.CODCLIENTE, "+
              "   CB.NOMBRECLIENTE, "+
              "   CB.VALORPAGO, "+
              "   CB.DETALLESPAGO, "+
              "   CB.DETALLESDOCU, "+
              "   CB.CODESTADO, "+
              "   IFNULL(U.NOMBRE,CB.CODUSUARIO) AS NOMBREUSUARIO, "+
              "   IFNULL(CC.EMAILCLIENTE,'-') AS EMAILCLIENTE,	 "+
              "   IFNULL((SELECT CI.BANCO FROM COBCIERRE CI  WHERE CI.CODEMPRESA = CB.CODEMPRESA AND CI.IDCIERRE = CB.FECHA  LIMIT 1), 'N') AS CERRADO 	 "+
              " FROM "+this.TABLA_COBRECIBOCAB+" CB "+
              "           LEFT OUTER JOIN COBUSUARIOS U ON U.CODUSUARIO = CB.CODUSUARIO "+
              "           LEFT OUTER JOIN COBCARTERACAB CC ON  CC.CODEMPRESA = CB.CODEMPRESA AND trim(CC.CODCLIENTE) = trim(CB.CODCLIENTE) "+
              " WHERE CB.CODEMPRESA= '"+empresa+"'"+ 
              " AND CB.FECHA BETWEEN '"+fdesde+"' AND '"+fhasta+"'"+
              " AND CB.CODUSUARIO = '"+codigoUsuario+"'"+
              " ORDER BY "+
              //" CB.FECHA DESC,  "+
              //" IFNULL(CAST(TRIM(SUBSTR(CB.IDRECIBO,14, LENGTH(CB.IDRECIBO))) AS INTEGER) ,0) DESC, "+
              " CB.ROWID DESC ";

    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }

  //Obtener Recibos Cobros
  eliminarCobros(empresa:string, idrecibo:string){
    let sql = "DELETE FROM "+this.TABLA_COBRECIBOCAB+" WHERE CODEMPRESA = '"+empresa+"' AND ROWID = "+idrecibo+" ";
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, []);
  }

  //Cambiar Estado Cobros
  cambiarEstadoCobros(empresa:string, idrecibo:string, estado:string, secuenciaRecibo:string){

    let sql = "UPDATE "+this.TABLA_COBRECIBOCAB+" SET CODESTADO = '"+estado+"' ";

    //Si se cambia el estado a Confirmado se actualiza el IDRECIBO
    if('CONFIRMADO' == estado && secuenciaRecibo != null){
      sql = sql +", IDRECIBO = '"+secuenciaRecibo+"' ";
    }
    //************************************************************

    sql = sql +" WHERE CODEMPRESA = '"+empresa+ "' AND ROWID = "+idrecibo+" ";

    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, []);
  }

  //Realiza la actualizacion de los cobros
  actualizarCobros(entidadCobro:any){
    let sql = "UPDATE "+this.TABLA_COBRECIBOCAB+
              " SET VALORPAGO = '"+entidadCobro.VALORPAGO+"', "+
              "     DETALLESPAGO = '"+entidadCobro.DETALLESPAGO+"', "+
              "     DETALLESDOCU = '"+entidadCobro.DETALLESDOCU+"' "+
              " WHERE CODEMPRESA = '"+entidadCobro.CODEMPRESA+"' "+
              " AND ROWID = "+entidadCobro.ID+" ";

    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, []); 
  } 

  //************* CIERRE ****************
  obtenerCierreCobranzas(empresa:string, idcierre:string){
    let sql = "SELECT * FROM "+this.TABLA_COBCIERRE+" C "+
              " WHERE CODEMPRESA = '"+empresa+"' "+
              "  AND IDCIERRE = '"+idcierre+"' ";

    console.log("obtenerCierreCobranzas ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }

  obtenerCierresPendientes(empresa:string, idcierre:string,){
    let sql = "SELECT * FROM "+this.TABLA_COBCIERRE+" C "+
              " WHERE CODEMPRESA = '"+empresa+"' "+ 
              "   AND IDCIERRE <> '"+idcierre+"' "+
              "   AND IFNULL(BANCO,'N') <> 'S' ";

    console.log("obtenerCierreCobranzas ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
        registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));
  }

  actualizarCierreCobranzas(entidadCierre:any){
    let sql = "UPDATE "+this.TABLA_COBCIERRE+
              " SET BANCO = '"+entidadCierre.BANCO+"', "+
              "     NUMDEPOSITO = '"+entidadCierre.NUMDEPOSITO+"', "+
              "     VALOR = '"+entidadCierre.VALOR+"', "+
              "     DETALLECIERRE = '"+entidadCierre.DETALLECIERRE+"' "+
              " WHERE CODEMPRESA = '"+entidadCierre.CODEMPRESA+"' "+
              " AND IDCIERRE = '"+entidadCierre.IDCIERRE+"' ";
    console.log("sql ==> "+sql);
    return this.db.executeSql(sql, []); 
  } 

  //Valida que todos los cobros hayan sido Enviados a MBW
  obtenerCobrosCierre(empresa:string, idcierre:string){
    let sql = "SELECT * FROM "+this.TABLA_COBRECIBOCAB+" CB "+
              " WHERE CB.CODEMPRESA= '"+empresa+"'"+ 
              " AND CB.FECHA = '"+idcierre+"' "+
              " AND CB.CODESTADO <> 'ANULADO' ";

    console.log("obtenerCobrosCierre ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
      registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));  
  }

  //Valida que todos los cobros hayan sido Enviados a MBW
  obtenerCobrosEstado(estado:string){
    let sql = "SELECT * FROM "+this.TABLA_COBRECIBOCAB+" CB "+
              " WHERE CB.CODESTADO = '"+estado+"' "; 
              
    console.log("obtenerCobrosEstado ==> "+sql);
    return this.db.executeSql(sql, [])
    .then(response => {
      let registros = [];
      for (let index = 0; index < response.rows.length; index++) {
      registros.push( response.rows.item(index) );
      }
      return Promise.resolve( registros );
    })
    .catch(error => Promise.reject(error));  
  }


}
