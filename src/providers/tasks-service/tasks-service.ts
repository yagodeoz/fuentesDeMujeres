//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as moment from "moment";

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
  //VTAMA
  public TABLA_NC_MODULOSNC = "GENMODULOSNC";
  public TABLA_NC_TIPOSNC = "GENTIPOSNOTACREDITO";
  //VTAMA
  public TABLA_FACNOTACREDITOCAB = "FACNOTACREDITOCAB";
  public TABLA_FACNOTACREDITODET = "FACNOTACREDITODET";
  //VTAMA
  public TABLA_SOLICITUDESNC = "SOLICITUDESNC";
  public TABLA_NCPARAMETROS = "NCPARAMETROS";


  //Creacion Tablas
  public SQL_COBPARAMETROS  = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBPARAMETROS+'('
                          +'CODPARAMETRO TEXT PRIMARY KEY, '
                          +'VALOR TEXT NOT NULL)';

  public SQL_COBUSUARIOS = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_COBUSUARIOS+'('
                          +'CODUSUARIO TEXT PRIMARY KEY, '
                          +'NOMBRE TEXT, '
                          +'CLAVE TEXT, '
                          +'CLIENTESTODOS TEXT, '
                          +'ULTIMAACTUALIZACION TEXT,'
                          +'FECHAACTNC TEXT)';

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
  //VTAMA
  public SQL_GENMODULOSNC = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_NC_MODULOSNC+'('
                            +'CODMODULO TEXT,'
                            +'DESC_MODULO TEXT)';

  public SQL_GENTIPOSNOTACREDITO = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_NC_TIPOSNC+'('
                                    +'TIPONC TEXT, '
                                    +'DESC_TIPO_NC TEXT, '
                                    +'MODULO TEXT)';
  //VTAMA
  public SQL_FACNOTACREDITOCAB = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_FACNOTACREDITOCAB+'('
                                  +'CODEMPRESA TEXT,'
                                  +'CODCLIENTE TEXT,'
                                  +'DATOS_CLIENTE TEXT,'
                                  +'TIPOCLIENTE TEXT,'
                                  +'CODAGENCIA TEXT,'
                                  +'CODTIPOCMPR TEXT,'
                                  +'NUMCMPRVENTA TEXT,'
                                  +'NUMDOCUMENTO TEXT,'
                                  +'VENDEDOR TEXT,'
                                  +'SUBTOTAL TEXT,'
                                  +'DESCUENTO TEXT,'
                                  +'IMPUESTO TEXT,'
                                  +'TOTAL TEXT,'
                                  +'FECHAREGISTRO TEXT,'
                                  +'CODAGENCIACXC TEXT,'
                                  +'CODTIPOCMPRCXC TEXT,'
                                  +'NUMCXCDOCUMENTOCXC TEXT,'
                                  +'FECHAVCTO TEXT,'
                                  +'VALORDOC TEXT,'
                                  +'SALDODOC TEXT)';
  //VTAMA
  public SQL_FACNOTACREDITODET = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_FACNOTACREDITODET+'('
                                  +'IDFACNC INTEGER PRIMARY KEY,'
                                  +'CODAGENCIA TEXT,'
                                  +'CODTIPOCMPR TEXT,'
                                  +'NUMCMPRVENTA TEXT,'
                                  +'NUMCMPRVENTADET TEXT,'
                                  +'ARTICULO TEXT,'
                                  +'COSTO TEXT,'
                                  +'CANTIDAD TEXT,'
                                  +'PRECIO TEXT,'
                                  +'SUBTOTAL TEXT,'
                                  +'DESCUENTO TEXT,'
                                  +'PORCDESCUENTO TEXT,'
                                  +'IMPUESTO TEXT,'
                                  +'PORCIMPUESTO TEXT,'
                                  +'TOTAL TEXT,'
                                  +'ESPREMIOOPROMOCION TEXT,'
                                  +'CANTIDADDEVUELTA TEXT,'
                                  +'NUMCMPRVENTADETAPLICA TEXT,'
                                  +'CODARTICULO TEXT,'
                                  +'CANTIDADNOCONFORME TEXT )';
  //VTAMA
  public SQL_SOLICITUDESNC = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_SOLICITUDESNC+'('
                              +'CODEMPRESA TEXT,'
                              +'TIPONOTACREDITO TEXT, '
                              +'IDNOTACREDITO TEXT, '
                              +'FECHA TEXT,'
                              +'CODUSUARIO TEXT,'
                              +'CLIENTE TEXT,'
                              +'DETALLESNC TEXT,'
                              +'CODESTADO TEXT,'
                              +'OBSERVACIONES TEXT,'
                              +'FECRESP_MWB TEXT )';

  public SQL_NCPARAMETROS  = 'CREATE TABLE IF NOT EXISTS '+this.TABLA_NCPARAMETROS+'('
    +'CODUSUARIO TEXT , '
    +'FECHAACTUALIZANC TEXT )';
  //public esPrivez: boolean =false;//15032021


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
    //VTAMA
    //this.crearTabla(this.TABLA_NC_MODULOSNC);
    //this.crearTabla(this.TABLA_NC_TIPOSNC);
    this.crearTabla(this.TABLA_FACNOTACREDITOCAB);
    this.crearTabla(this.TABLA_FACNOTACREDITODET);
    this.crearTabla(this.TABLA_SOLICITUDESNC);
    this.crearTabla(this.TABLA_NCPARAMETROS);
    //this.esPrivez = true;//15032021
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
      sql = sql.replace('[CAMPOS]',"CODUSUARIO, NOMBRE, CLAVE, CLIENTESTODOS, ULTIMAACTUALIZACION,FECHAACTNC");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?");

      console.log("sql ==> "+sql);
      console.log("FECHAENVIADAINSERTAR--> "+registro.FECHAACTNC);
      console.log("CADENAVALORES--> "+JSON.stringify(registro) );
      valores = [registro.CODUSUARIO,
                 registro.NOMBRE,
                 registro.CLAVE,
                 registro.CLIENTESTODOS,
                 registro.ULTIMAACTUALIZACION,
                 registro.FECHAACTNC];

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
    //VTAMA
    if(this.TABLA_NC_MODULOSNC == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_NC_MODULOSNC);
      sql = sql.replace('[CAMPOS]',"CODMODULO,DESC_MODULO");
      sql = sql.replace('[VALORES]',"?,?");
      valores = [registro.CODMODULO,
                 registro.DESC_MODULO];
    }

    if(this.TABLA_NC_TIPOSNC == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_NC_TIPOSNC);
      sql = sql.replace('[CAMPOS]',"TIPONC,DESC_TIPO_NC,MODULO");
      sql = sql.replace('[VALORES]',"?,?,?");
      valores = [registro.TIPONC,
                 registro.DESC_TIPO_NC,
                 registro.MODULO];
    }
    if(this.TABLA_FACNOTACREDITOCAB == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_FACNOTACREDITOCAB);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA,CODCLIENTE,DATOS_CLIENTE,TIPOCLIENTE,CODAGENCIA,CODTIPOCMPR,NUMCMPRVENTA,NUMDOCUMENTO,VENDEDOR,"+
                                                        "SUBTOTAL,DESCUENTO,IMPUESTO,TOTAL,FECHAREGISTRO,CODAGENCIACXC,CODTIPOCMPRCXC,NUMCXCDOCUMENTOCXC,FECHAVCTO,"+
                                                        "VALORDOC,SALDODOC");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?");
      valores = [registro.CODEMPRESA,
                registro.CODCLIENTE,
                registro.DATOS_CLIENTE,
                registro.TIPOCLIENTE,
                registro.CODAGENCIA,
                registro.CODTIPOCMPR,
                registro.NUMCMPRVENTA,
                registro.NUMDOCUMENTO,
                registro.VENDEDOR,
                registro.SUBTOTAL,
                registro.DESCUENTO,
                registro.IMPUESTO,
                registro.TOTAL,
                registro.FECHAREGISTRO,
                registro.CODAGENCIACXC,
                registro.CODTIPOCMPRCXC,
                registro.NUMCXCDOCUMENTOCXC,
                registro.FECHAVCTO,
                registro.VALORDOC,
                registro.SALDODOC];
    }

    //VTAMA
    if(this.TABLA_FACNOTACREDITODET == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_FACNOTACREDITODET);
      sql = sql.replace('[CAMPOS]',"CODAGENCIA,CODTIPOCMPR,NUMCMPRVENTA,NUMCMPRVENTADET,ARTICULO,COSTO,CANTIDAD,PRECIO,SUBTOTAL,DESCUENTO," +
                                                        "PORCDESCUENTO,IMPUESTO,PORCIMPUESTO,TOTAL,ESPREMIOOPROMOCION,CANTIDADDEVUELTA," +
                                                        "NUMCMPRVENTADETAPLICA,CODARTICULO,CANTIDADNOCONFORME");

      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?");
      valores = [registro.CODAGENCIA,
                  registro.CODTIPOCMPR,
                  registro.NUMCMPRVENTA,
                  registro.NUMCMPRVENTADET,
                  registro.ARTICULO,
                  registro.COSTO,
                  registro.CANTIDAD,
                  registro.PRECIO,
                  registro.SUBTOTAL,
                  registro.DESCUENTO,
                  registro.PORCDESCUENTO,
                  registro.IMPUESTO,
                  registro.PORCIMPUESTO,
                  registro.TOTAL,
                  registro.ESPREMIOOPROMOCION,
                  registro.CANTIDADDEVUELTA,
                  registro.NUMCMPRVENTADETAPLICA,
                  registro.CODARTICULO,
                  registro.CANTIDADNOCONFORME];
    }
    if(this.TABLA_SOLICITUDESNC == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_SOLICITUDESNC);
      sql = sql.replace('[CAMPOS]',"CODEMPRESA,TIPONOTACREDITO,IDNOTACREDITO,FECHA,CODUSUARIO,CLIENTE,DETALLESNC,CODESTADO,OBSERVACIONES,FECRESP_MWB");
      sql = sql.replace('[VALORES]',"?,?,?,?,?,?,?,?,?,?");
      valores = [registro.CODEMPRESA,
        registro.TIPONOTACREDITO,
        registro.IDNOTACREDITO,
        registro.FECHA,
        registro.CODUSUARIO,
        registro.CLIENTE,
        registro.DETALLESNC,
        registro.CODESTADO,
        registro.OBSERVACIONES,
        registro.FECRESP_MWB];
    }

    if(this.TABLA_NCPARAMETROS == tabla){
      sql = sql.replace('[TABLA]',this.TABLA_NCPARAMETROS);
      sql = sql.replace('[CAMPOS]',"CODUSUARIO, FECHAACTUALIZANC");
      sql = sql.replace('[VALORES]',"?,?");

      console.log("sql ==> "+sql);
      valores = [registro.CODUSUARIO, registro.FECHAACTUALIZANC];
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

    //VTAMA
    if(this.TABLA_NC_MODULOSNC == tabla){
      sql = this.SQL_GENMODULOSNC;
    }
    if(this.TABLA_NC_TIPOSNC == tabla){
      sql = this.SQL_GENTIPOSNOTACREDITO;
    }
    if(this.TABLA_FACNOTACREDITOCAB == tabla){
      sql = this.SQL_FACNOTACREDITOCAB;
    }
    if (this.TABLA_FACNOTACREDITODET == tabla){
      sql = this.SQL_FACNOTACREDITODET;
    }
    if (this.TABLA_SOLICITUDESNC == tabla){
      sql = this.SQL_SOLICITUDESNC;
    }
    if (this.TABLA_NCPARAMETROS == tabla){
      sql = this.SQL_NCPARAMETROS;
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

  /**_________________________________________________________________*/
  //VTAMA - Query clientes NC Principal
  obtenerClientesNotaCredito(filtros:any){
    let sql = "SELECT distinct codcliente,datos_cliente,tipocliente FROM "+this.TABLA_FACNOTACREDITOCAB +
              "  where codempresa = "+filtros.empresa +
              "  and datos_cliente || codcliente like '%"+filtros.cliente+"%'" +
              "  LIMIT 15";

    console.log("obtenerClientesNC ==> "+sql);

    return this.db.executeSql(sql, [])
      .then(response => {
        let registros = [];
        for (let index = 0; index < response.rows.length; index++) {
          registros.push( response.rows.item(index) );
        }
        console.log("EjecutaConsultaNC: "+registros.length );
        return Promise.resolve( registros );
      })
      .catch(error => Promise.reject(error));
  }

  /**_________________________________________________________________*/
  //VTAMA 15-01-2021
  obtenerItemDevolucion(filtros:any){
    console.log("FILTRO ARTICULO==> "+filtros.articulo+"CLIENTE: "+filtros.cliente+" EMPRESA->"+filtros.empresa);
    let sql = "select CAB.FECHAREGISTRO," +
      "       cab.CODAGENCIA,"+
      "       cab.CODTIPOCMPR,"+
      "       DET.ARTICULO," +
      "       det.NUMCMPRVENTA," +
      "       det.NUMCMPRVENTADET," +
      "       cab.NUMDOCUMENTO," +
      "       det.PRECIO," +
      "       det.PORCDESCUENTO," +
      "       det.DESCUENTO," +
      "       det.CANTIDAD," +
      "       det.SUBTOTAL," +
      "       det.IMPUESTO," +
      "       det.TOTAL," +
      "       det.CODARTICULO," +
      "       det.CANTIDADDEVUELTA" +
      "  from facnotacreditocab cab" +
      " inner join facnotacreditodet det" +
      "    on (det.NUMCMPRVENTA = cab.NUMCMPRVENTA and" +
      "       det.CODTIPOCMPR = cab.CODTIPOCMPR)" +
      " where det.ARTICULO like '%"+filtros.articulo+"%'" +
      "   and cab.CODCLIENTE = "+filtros.cliente+
      "   and cab.CODEMPRESA = "+filtros.empresa +
      "   and cab.FECHAREGISTRO >= date('now', '-1 year')" +
      " order by cab.FECHAREGISTRO desc "+
      " LIMIT 50 ";

    console.log("ItemsDevolver ==> "+sql);

    return this.db.executeSql(sql, [])
      .then(response => {
        let registros = [];
        for (let index = 0; index < response.rows.length; index++) {
          registros.push( response.rows.item(index) );
        }
        console.log("EjecutaItemDevolver : "+registros.length );
        //alert("obtenerItemDevolucion-->"+registros.length );
        return Promise.resolve( registros );
      })
      .catch(error => Promise.reject(error));
  }
  /**_________________________________________________________________*/
  obtenerFacturaDevolucion(filtros:any){
    console.log("FILTRO ARTICULO==> "+filtros.articulo+"CLIENTE: "+filtros.cliente+" EMPRESA->"+filtros.empresa);
    let sql = "select " +
      "CAB.FECHAREGISTRO," +
      "cab.CODAGENCIA,"+
      "cab.CODTIPOCMPR,"+
      "DET.ARTICULO,     " +
      "det.NUMCMPRVENTA, " +
      "det.NUMCMPRVENTADET, " +
      "cab.NUMDOCUMENTO, " +
      "det.PRECIO,       " +
      "det.PORCDESCUENTO," +
      "det.DESCUENTO,    " +
      "det.CANTIDAD,     " +
      "det.SUBTOTAL,     " +
      "det.IMPUESTO,     " +
      "det.TOTAL,        " +
      "det.CODARTICULO,    " +
      "det.CANTIDADDEVUELTA  " +
      "from facnotacreditocab cab inner join facnotacreditodet det    on (det.NUMCMPRVENTA = cab.NUMCMPRVENTA and det.CODTIPOCMPR = cab.CODTIPOCMPR) " +
      " where cab.NUMDOCUMENTO = '"+filtros.articulo.trim()+"' "+
      " and cab.CODCLIENTE = "+filtros.cliente+
      " and cab.CODEMPRESA = "+filtros.empresa +
      " and cab.FECHAREGISTRO >= date('now', '-1 year') " +
      " order by cab.FECHAREGISTRO desc " +
      " LIMIT 150 ";

    console.log("FACTURA ==> "+sql);

    return this.db.executeSql(sql, [])
      .then(response => {
        let registros = [];
        for (let index = 0; index < response.rows.length; index++) {
          registros.push( response.rows.item(index) );
        }
        console.log("EjecutaFacturaDevolver : "+registros.length );
        //alert("obtenerFacturaDevolucion-->"+registros.length );
        return Promise.resolve( registros );
      })
      .catch(error => Promise.reject(error));
  }


  /**_________________________________________________________________*/


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

  //Eliminar registros de Nota de credito
  eliminarRegNotaCredito(empresa:string, rowidnotacredito:string){
    let sql = "DELETE FROM "+this.TABLA_SOLICITUDESNC+" WHERE CODEMPRESA = '"+empresa+"' AND ROWID = "+rowidnotacredito+" ";
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

  /*------------------------------------------------------------------------------------------------*/
  //Cambiar Estado Cobros
  cambiarEstadoNC(empresa:string, rowidnotacredito:string, estado:string, numcmprventa:string){
    console.log("EnvioNC 4");
    let sql = "UPDATE "+this.TABLA_SOLICITUDESNC+" SET CODESTADO = '"+estado+"' ";

    //Si se cambia el estado a Confirmado se actualiza el IDRECIBO
    if('ENVIADO' == estado && numcmprventa != null){
      sql = sql +", IDNOTACREDITO = '"+numcmprventa+"' ";
    }
    //************************************************************

    sql = sql +" WHERE CODEMPRESA = '"+empresa+ "' AND ROWID = "+rowidnotacredito+" ";

    console.log("sql ACTUALIZA==> "+sql);
    return this.db.executeSql(sql, []);
  }
  /*------------------------------------------------------------------------------------------------*/
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

  /*------------------------------------------------------------------------------------------------*/
  //Realiza la actualizacion de registro de nota de credito
  //VTAMA
  actualizarNotaCredito(entidadNotacre:any){
    let sql = "UPDATE "+this.TABLA_SOLICITUDESNC+
      " SET DETALLESNC = '"+entidadNotacre.DETALLESNC+"' "+
      " WHERE CODEMPRESA = '"+entidadNotacre.CODEMPRESA+"' "+
      " AND ROWID = "+entidadNotacre.ID+" ";

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

  //Nuevos metodos para cargar informacion de notas de credito
  //Obtener Recibos Cobros
  obtenerSolicitudNotaCredito(empresa:string, fdesde:string, fhasta:string, codigoUsuario:string){

    let sql = " SELECT CAST(NC.ROWID AS TEXT) AS ID," +
      "         NC.CODEMPRESA," +
      "         NC.TIPONOTACREDITO," +
      "         NC.IDNOTACREDITO," +
      "         NC.FECHA," +
      "         NC.CODUSUARIO," +
      "         NC.CLIENTE,       " +
      "         NC.DETALLESNC,         " +
      "         NC.CODESTADO," +
      "         NC.OBSERVACIONES," +
      "         IFNULL(U.NOMBRE,NC.CODUSUARIO) AS NOMBREUSUARIO	 "+
      " FROM "+this.TABLA_SOLICITUDESNC+" NC "+
      "           LEFT OUTER JOIN COBUSUARIOS U ON U.CODUSUARIO = NC.CODUSUARIO "+
      " WHERE NC.CODEMPRESA= '"+empresa+"'"+
      " AND NC.FECHA BETWEEN '"+fdesde+"' AND '"+fhasta+"'"+
      " AND NC.CODUSUARIO = '"+codigoUsuario+"'"+
      " ORDER BY NC.ROWID DESC ";

    console.log("sql SOLICITUDES NOTA DE CREDITO ==> "+sql);
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

  //verifica que existan datos en tablas de nota de credito
  existenRegistros(tabla:string){
    let sql = "SELECT COUNT(*) as VALOR FROM "+ tabla ;
    console.log("existenRegistros ==> "+sql);
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
  //actualiza fecha 160302021

  updateFechaNC(registro: any){
    let sql = "UPDATE "+this.TABLA_NCPARAMETROS+" SET FECHAACTUALIZANC = ? WHERE CODUSUARIO = '"+registro.CODUSUARIO+"'";
    console.log("sql ==> "+sql + " fecha--> "+registro.ULTIMAACTUALIZACION);
    return this.db.executeSql(sql, [registro.ULTIMAACTUALIZACION]);
  }

  obtenerFechaSincroNC(usuario:string){
    let sql = "SELECT FECHAACTUALIZANC as fechaSincro from NCPARAMETROS WHERE CODUSUARIO = '"+ usuario+"'" ;
    console.log("FECHASINCRO_NC ==> "+sql);
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


  //verifica que existan datos en tablas de nota de credito
  verificaParamnc(){
    let sql = "SELECT COUNT(*) as VALOR FROM NCPARAMETROS ";
    console.log("verificaParamnc ==> "+sql);
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
