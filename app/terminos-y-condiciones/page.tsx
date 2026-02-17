import Image from "next/image"
import Link from "next/link"

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-black py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Image src="/logo-weincard.png" alt="Weincard Logo" width={150} height={40} className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-clash text-4xl md:text-5xl font-bold text-black mb-8">Términos y Condiciones</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* SECCIÓN PRIMERA */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4 uppercase">
              Sección Primera - Aspectos Preliminares
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">1. ADVERTENCIA SOBRE OBLIGATORIEDAD</h3>
                <p className="text-gray-700 leading-relaxed">
                  Los presentes TÉRMINOS Y CONDICIONES, en adelante "TyC", constituyen, para todos los efectos legales,
                  un acuerdo de voluntades entre Usted, en adelante el "Usuario", según se encuentra definido en el
                  Numeral 3, por una parte y WEINCARD S.A.S., en adelante "WEINCARD", propietario de la plataforma
                  weincard.com, por la otra.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                  WEINCARD.COM ES UNA PLATAFORMA WEB CUYO OBJETIVO CONSISTE EN PERMITIR A LOS USUARIOS MIEMBRO, ACCEDER
                  A BENEFICIOS AL MOMENTO DE ADQUIRIR UN PRODUCTO O SERVICIO OFRECIDO POR LOS USUARIOS COMERCIO.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                  WEINCARD LO INVITA AMABLEMENTE A QUE LEA LOS SIGUIENTES TYC DE MANERA DETENIDA Y CONSCIENTE, TODA VEZ
                  QUE AL NAVEGAR LA PLATAFORMA WEINCARD.COM Y/O AL HACER "CLIC" EN EL BOTÓN HABILITADO PARA ELLO (EN LOS
                  CASOS EN QUE ELLO SEA REQUERIDO, SEGÚN LO DISPUESTO EN LAS SECCIONES TERCERA Y CUARTA), CONSTITUYE LA
                  ACEPTACIÓN DE LOS MISMOS, QUEDANDO, POR ENDE, VINCULADO AL CUMPLIMIENTO DE LOS POSTULADOS QUE
                  AUTORIZAN Y REGLAMENTAN LAS CONDICIONES DE PRESTACIÓN DE LOS SERVICIOS, USO Y ACCESO A LA PLATAFORMA
                  WEINCARD.COM, SU INFORMACIÓN, GRÁFICOS, ENLACES, CONTENIDOS Y DEMÁS COMPONENTES RELACIONADOS CON, O
                  VINCULADOS A LA MISMA.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Los presentes TyC pueden ser actualizados de manera ocasional por parte de WEINCARD. Cuando ello
                  ocurra, WEINCARD tomará las medidas que considere pertinentes para notificar dicha situación y
                  permitirle aceptar o rechazar la nueva versión de los TyC. En cualquier caso, es su deber revisar la
                  versión más actualizada de los TyC, a través del link https://weincard.com/terms.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  El uso y/o acceso a weincard.com, o de cualquier herramienta o servicio ofrecido allí, con
                  posterioridad a la modificación o cambio de cualquier elemento de los TyC, es interpretado como
                  aceptación expresa del Usuario a obligarse por lo dispuesto en la versión más actualizada de los TyC.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Los presentes TyC son regidos por las normas del ordenamiento civil, mercantil de la República de
                  Colombia y demás leyes aplicables.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">2. ESTRUCTURA DE LOS TyC</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Los presentes TyC se encuentra divididos en cinco Secciones diferentes que regulan aspectos
                  específicos de la relación entre WEINCARD y sus Usuarios destinatarios. De la siguiente manera:
                </p>
                <ul className="list-none text-gray-700 space-y-2 ml-4">
                  <li>
                    <strong>2.1.</strong> Sección Primera: Aspectos Introductorios y su carácter vinculante para
                    cualquier tipo de Usuario.
                  </li>
                  <li>
                    <strong>2.2.</strong> Sección Segunda: Establece las Condiciones Generales de Uso y su carácter
                    vinculante para cualquier tipo de Usuario.
                  </li>
                  <li>
                    <strong>2.3.</strong> Sección Tercera: Condiciones Especiales para los Usuarios Comercio y está
                    destinada de manera preferente para los Usuarios Comercio.
                  </li>
                  <li>
                    <strong>2.4.</strong> Sección Cuarta: Condiciones Especiales para los Usuarios Miembros y está
                    destinada de manera preferente para los Miembros.
                  </li>
                  <li>
                    <strong>2.5.</strong> Sección Quinta: Disposiciones Finales y su carácter vinculante para cualquier
                    tipo de Usuario.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECCIÓN SEGUNDA */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4 uppercase">
              Sección Segunda - Condiciones Generales
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">3. DEFINICIONES</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tal como se utilizan en los presentes TyC y en adición a cualquier otro término definido a lo largo
                  del presente texto, los siguientes términos tendrán los significados que se relacionan a continuación:
                </p>
                <div className="space-y-3 ml-4">
                  <p className="text-gray-700">
                    <strong>3.1. Actualización:</strong> Significa una revisión, corrección o actualización de versión
                    de la plataforma weincard.com;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.2. Bases de Datos personales:</strong> Hace referencia a los Datos personales
                    procesados​​por WEINCARD en relación con este Acuerdo;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.3. Contenido del Usuario Comercio:</strong> Significa todos los datos, obras y materiales
                    cargados o almacenados en la Plataforma; transmitido por la Plataforma a instancias del Usuario
                    Comercio;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.4. Cuenta:</strong> Significa una cuenta que permite a un Usuario acceder y utilizar los
                    Servicios;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.5. Dato personal:</strong> Cualquier información que permita identificar a una persona
                    natural, según se dispone en la ley 1581 de 2012;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.7. Derechos de propiedad intelectual:</strong> Significa todos los derechos de propiedad
                    intelectual en cualquier lugar del mundo, registrable o no registrable, registrado o no registrado;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.14. Plataforma weincard.com:</strong> Significa la arquitectura computacional alojada en
                    el dominio weincard.com, diseñada, desarrollada, desplegada y gestionada por WEINCARD;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.17. Servicios WEINCARD:</strong> Son los servicios de afiliación que otorgan a los
                    usuarios miembros acceso continuo a contenido, servicios, o beneficios a cambio de una tarifa
                    recurrente;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.18. Tarifas:</strong> Valores cobrados por los servicios de afiliación, suscripción de
                    hosting de información y cloud computing;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.19. Usuario:</strong> Es el término genérico el Usuario, que accede a la plataforma
                    weincard.com;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.20. Usuario Miembro:</strong> Es el Usuario que accede a la plataforma weincard.com, y
                    adquiere la membresía ofrecida por WEINCARD;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.21. Usuario Comercio:</strong> Es el Usuario que se vincula a la plataforma weincard.com
                    con el objetivo de ofrecer la venta sus productos o servicios;
                  </p>
                  <p className="text-gray-700">
                    <strong>3.22. Vigencia:</strong> Significa el periodo de duración de este Acuerdo;
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">4. ACEPTACIÓN</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>4.1.</strong> Para todos los efectos legales, se entiende que, al acceder, navegar y utilizar
                  cualquier componente de weincard.com, o utilizar sus herramientas, funciones o servicios, registrarse
                  como usuario, o ver cualquier texto, gráfico o video, el Usuario ha leído y acepta, sin limitación ni
                  condición alguna, los presentes TyC. Si el Usuario no está de acuerdo con estos TyC y, por ende, no
                  desea obligarse por los mismos, debe abstenerse de acceder a weincard.com o utilizar los servicios y
                  abandonar la plataforma a la mayor brevedad.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>4.2.</strong> El abandono de la Plataforma por parte del Usuario, en las condiciones expuestas
                  en el anterior párrafo, no implica la liberalidad para desconocer las obligaciones previamente
                  adquiridas al momento de aceptar los presentes TyC.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">5. DESCRIPCIÓN DE LA PLATAFORMA</h3>
                <p className="text-gray-700 leading-relaxed">
                  Weincard.com es una plataforma diseñada por WEINCARD, destinada a conectar a los Usuarios Miembros con
                  los Usuarios Comercio, para que los primeros puedan acceder a diferentes beneficios al momento de
                  adquirir bienes y servicios, y para que los comercios puedan ofrecer descuentos a ciertos
                  consumidores, permitiéndoles aprovechar su capacidad instalada, especialmente en horarios valle de su
                  operación.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">6. ALCANCE DE LOS SERVICIOS</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.1.</strong> WEINCARD utiliza la plataforma weincard.com con el objetivo de vincular Usuario
                  Miembro, a cambio de una retribución, para que estos puedan acceder a los beneficios ofrecidos por los
                  Usuarios Comercio.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.2.</strong> En complemento con lo anterior, WEINCARD actúa como LICENCIANTE de la plataforma
                  weincard.com, utilizada por Usuarios Comercio y los Usuarios Miembro para gestionar información,
                  alojar información y realizar campañas de mercadeo.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.3.</strong> En ningún momento podrá considerarse que WEINCARD actúa de manera directa o
                  indirecta como vendedor de cualquiera de los productos y/o servicios ofrecidos por los Usuarios
                  Comercio.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.4.</strong> En este orden de ideas, WEINCARD se compromete a cumplir con los servicios
                  relacionados con el funcionamiento de la plataforma, con las salvedades especificadas en estos TYC y
                  no se responsabiliza por el incumplimiento de los Usuarios Comercio.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.5.</strong> El Usurario Miembro deberá reclamar directamente ante el Usuario Comercio por el
                  incumplimiento de las obligaciones derivadas de una transacción entre ambos.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.6.</strong> WEINCARD no avala, recomienda, ofrece o aprueba los Productos ofrecidos por los
                  Usuarios Comercio. WEINCARD se limita a poner a disposición de los Usuarios Miembro la plataforma.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>6.7.</strong> En atención a lo anterior, el Usuario Miembro es consciente y acepta
                  voluntariamente que el uso de weincard.com, el acceso a los contenidos allí exhibidos y la adquisición
                  de cualquier producto, lo hace bajo su única y exclusiva responsabilidad.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">7. ACCESO A WEINCARD.COM</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  El acceso a WEINCARD.COM se regirá por las siguientes reglas:
                </p>
                <ul className="list-none text-gray-700 space-y-2 ml-4">
                  <li>
                    <strong>7.1. Acceso por Usuarios genéricos:</strong> Los Usuarios que acudan a weincard.com con la
                    única intención de navegar la plataforma, no requerirán registrarse y adquirir una cuenta de Usuario
                    Miembro o Usuario Comercio.
                  </li>
                  <li>
                    <strong>7.2. Acceso por Usuarios Comercio:</strong> Los Usuarios Comercio deberán celebrar un
                    acuerdo de alianza estratégica con WEINCARD.
                  </li>
                  <li>
                    <strong>7.3. Acceso por Usuarios Miembro:</strong> Para darse de alta como Usuario Miembro en
                    weincard.com y estar habilitado para acceder a los beneficios, el usuario deberá registrar
                    previamente sus datos personales y pagar el valor de la tarifa de la membresía.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">8. CREACIÓN DE CUENTA DE USUARIO</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Para efectos de obtener una cuenta de Usuario Miembro, se requiere que el Usuario diligencie un
                  formulario de registro que lo habilitará para acceder a beneficios mediante la obtención una "Cuenta
                  de Usuario" y una "Contraseña", de conformidad con las siguientes reglas:
                </p>
                <ul className="list-none text-gray-700 space-y-3 ml-4">
                  <li>
                    <strong>8.1.</strong> El Usuario se obliga a proporcionar a WEINCARD únicamente información propia,
                    autentica, actualizada, completa y precisa.
                  </li>
                  <li>
                    <strong>8.2.</strong> La información personal suministrada se regirá por las "Políticas de
                    Tratamiento de Información Personal" de WEINCARD, disponible en{" "}
                    <Link href="/politica-de-privacidad" className="text-[#8B2332] hover:underline">
                      https://weincard.com/privacy
                    </Link>
                  </li>
                  <li>
                    <strong>8.3.</strong> La información personal que se proporcione a WEINCARD durante el proceso de
                    registro y uso de la Plataforma será utilizada en general para las siguientes finalidades:
                    <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                      <li>Realizar actividades de mercadeo, promoción y/o publicidad</li>
                      <li>Generar una comunicación óptima en relación con los servicios</li>
                      <li>Evaluar la calidad de los productos y servicios</li>
                      <li>Prestar asistencia, servicio y soporte técnico</li>
                      <li>Controlar y prevenir el fraude en todas sus modalidades</li>
                      <li>Transmisión de datos personales a aliados estratégicos</li>
                    </ul>
                  </li>
                  <li>
                    <strong>8.4.</strong> El Usuario se obliga a actualizar su información, de manera inmediata, ante la
                    ocurrencia de algún cambio en la misma.
                  </li>
                  <li>
                    <strong>8.5.</strong> WEINCARD se reserva el derecho de suspender o cancelar la Cuenta de Usuario
                    cuando verifique que la información suministrada es ajena, falsa, inexacta, desactualizada o
                    incompleta.
                  </li>
                  <li>
                    <strong>8.6.</strong> Una vez efectuado el registro, el Usuario obtendrá una Cuenta de Usuario y una
                    Contraseña que le permitirán acceder a la Plataforma. El Usuario es el único responsable sobre la
                    confidencialidad de su Cuenta de Usuario y su Contraseña.
                  </li>
                  <li>
                    <strong>8.7.</strong> Ante la ocurrencia de un uso no autorizado de su Cuenta de Usuario, el Usuario
                    debe notificar inmediatamente a WEINCARD sobre lo ocurrido.
                  </li>
                  <li>
                    <strong>8.9.</strong> Le es prohibido al Usuario la transferencia o autorización del uso de su
                    Cuenta de Usuario y/o Contraseña a otra persona.
                  </li>
                  <li>
                    <strong>8.12.</strong> El Usuario debe tomar todas las medidas necesarias para asegurarse de salir
                    correctamente de su Cuenta de Usuario al final de cada sesión.
                  </li>
                  <li>
                    <strong>8.13.</strong> El Usuario se obliga a notificar a WEINCARD sobre cualquier uso no autorizado
                    de su Contraseña o Cuenta de Usuario.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">9. TRATAMIENTO DE DATOS PERSONALES</h3>
                <p className="text-gray-700 leading-relaxed">
                  WEINCARD reconoce el derecho de sus Usuarios a autodeterminarse informativamente, por lo tanto, ha
                  diseñado una política de tratamiento de datos que le permite al Usuario entender los derechos que le
                  asisten como titular de la información. La política de tratamiento de datos personales de WEINCARD
                  está disponible para ser consultada en cualquier momento en{" "}
                  <Link href="/politica-de-privacidad" className="text-[#8B2332] hover:underline">
                    https://weincard.com/privacy
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">
                  10. AUTORIZACIÓN PARA CONSULTA Y REPORTE DE INFORMACIÓN FINANCIERA
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El Usuario, con la aceptación de estos términos y condiciones, autoriza expresamente a WEINCARD a
                  acceder a sus calificaciones de cartera como deudor de una obligación dineraria suministradas por las
                  entidades vigiladas por la Superintendencia Financiera de Colombia a las Centrales de Riesgos, con el
                  fin de que WEINCARD realice la calificación de riesgo.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">11. PROPIEDAD INTELECTUAL</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>11.1.</strong> El Usuario reconoce que weincard.com, sus canales, los datos, la información,
                  toda la tecnología subyacente que se utiliza en relación con la plataforma y los servicios de
                  WEINCARD, y todo el software, materiales, información, comunicación, textos, gráficos, enlaces, arte
                  electrónico, animaciones, audio, video, fotos y otros datos, disponibles en la plataforma
                  weincard.com, diferente al CONTENIDO DEL USUARIO COMERCIO, son proporcionados por WEINCARD o por
                  terceros autorizados y están protegidos por derecho de autor, derecho de imagen, marcas, patentes, o
                  formas diferentes del derecho de propiedad intelectual, de titularidad de WEINCARD o del respectivo
                  titular.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>11.2.</strong> Con excepción de lo expresamente autorizado por WEINCARD en estos TyC, el
                  Usuario no puede copiar, reproducir, publicar, distribuir, poner a disposición, modificar, crear
                  trabajos derivados, licenciar, vender, transferir, mostrar, transmitir, compilar o recoger en una base
                  de datos, o de cualquier manera explotar comercialmente cualquier parte de los activos de propiedad
                  intelectual de WEINCARD.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>11.3.</strong> Nada en este Acuerdo operará para transferir cualquier derecho de propiedad
                  intelectual de WEINCARD al Usuario.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">13. CONDUCTAS PROHIBIDAS</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Sólo se podrá acceder a weincard.com y utilizar los servicios para fines lícitos. Son usos prohibidos
                  de weincard.com, los siguientes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Utilizar la plataforma para cometer delitos o violar leyes</li>
                  <li>Cargar contenido ilegal, amenazante, difamatorio, obsceno u ofensivo</li>
                  <li>Infringir derechos de propiedad intelectual de terceros</li>
                  <li>Obstaculizar el acceso de otros usuarios a la plataforma</li>
                  <li>Hacerse pasar por terceros o representar falsamente su vinculación con terceros</li>
                  <li>Enviar spam o publicidad no solicitada</li>
                  <li>Intentar violar la seguridad de la Plataforma o de las redes conectadas</li>
                  <li>Recolectar información de otros usuarios sin autorización</li>
                  <li>Utilizar la plataforma para actividades fraudulentas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECCIÓN TERCERA */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4 uppercase">
              Sección Tercera - Condiciones Especiales para Usuario Comercio
            </h2>

            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                <strong>19. OBLIGACIONES DEL USUARIO COMERCIO</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                WEINCARD y EL USUARIO COMERCIO definirán de forma conjunta los beneficios a otorgar a los USUARIOS
                MIEMBRO, los cuales serán publicados en la plataforma weincard.com. El Usuario Comercio se obliga a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Definir de forma clara el alcance de los beneficios otorgados</li>
                <li>Otorgar en su integralidad los beneficios ofrecidos a los Usuarios Miembro</li>
                <li>Informar oportunamente a WEINCARD de circunstancias que impidan la prestación de servicios</li>
                <li>Respetar los derechos de propiedad intelectual de WEINCARD</li>
                <li>Garantizar calidad e idoneidad de los productos ofrecidos</li>
                <li>Suministrar información clara, veraz y completa sobre los productos y servicios</li>
                <li>Abstenerse de difundir publicidad engañosa o que induzca a error</li>
                <li>Permitir y atender las reclamaciones de los Usuarios Miembro</li>
                <li>Cumplir con todas las obligaciones legales, tributarias y laborales aplicables</li>
                <li>Mantener vigentes todos los permisos, licencias y autorizaciones requeridas</li>
              </ul>
            </div>
          </section>

          {/* SECCIÓN CUARTA */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4 uppercase">
              Sección Cuarta - Condiciones Especiales para Usuarios Miembros
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">20. MEMBRESÍA</h3>
                <p className="text-gray-700 leading-relaxed">
                  Los Usuarios Miembros son aquellos que adquieren la Membresía WEINCARD, a cambio del pago de la tarifa
                  definida en el plan escogido. Esta membresía les permite acceder a beneficios exclusivos en diferentes
                  comercios aliados.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  La membresía es personal e intransferible, y sólo podrá hacer uso de la misma el titular debidamente
                  registrado en la plataforma. La vigencia de la membresía dependerá del plan seleccionado por el
                  Usuario Miembro.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">21. OBLIGACIONES DEL USUARIO MIEMBRO</h3>
                <p className="text-gray-700 leading-relaxed mb-3">El Usuario Miembro se obliga a:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Pagar oportunamente el valor de la membresía WEINCARD según el plan seleccionado</li>
                  <li>Hacer uso personal e intransferible de la membresía adquirida</li>
                  <li>Cumplir con los presentes TyC y las políticas de WEINCARD</li>
                  <li>Proporcionar información completa, cierta y actualizada a WEINCARD</li>
                  <li>Comunicar oportunamente cualquier novedad o inconsistencia con el servicio</li>
                  <li>Utilizar la plataforma de manera responsable y lícita</li>
                  <li>No compartir sus credenciales de acceso con terceros</li>
                  <li>Respetar los términos y condiciones de cada Usuario Comercio</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">22. FORMAS DE PAGO</h3>
                <p className="text-gray-700 leading-relaxed">
                  WEINCARD pondrá a disposición de los Usuarios Miembro diferentes medios de pago para la adquisición de
                  la membresía, incluyendo tarjetas de crédito, débito, PSE y otros medios de pago electrónico
                  autorizados en Colombia.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">23. RENOVACIÓN Y CANCELACIÓN</h3>
                <p className="text-gray-700 leading-relaxed">
                  La membresía se renovará automáticamente al finalizar cada periodo de suscripción, salvo que el
                  Usuario Miembro manifieste expresamente su voluntad de no renovar. El Usuario Miembro puede cancelar
                  su membresía en cualquier momento a través de la plataforma o contactando a soporte.
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN QUINTA */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4 uppercase">
              Sección Quinta - Disposiciones Finales
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">25. LIMITACIONES DE RESPONSABILIDAD</h3>
                <p className="text-gray-700 leading-relaxed">
                  El Usuario reconoce y acepta que weincard.com es una plataforma que funciona sobre un software
                  complejo y que no está totalmente libre de defectos y errores. WEINCARD no será responsable por:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                  <li>Interrupciones del servicio por mantenimiento programado o causas de fuerza mayor</li>
                  <li>Pérdida de datos causada por fallas técnicas</li>
                  <li>Daños derivados del uso indebido de la plataforma por parte de los usuarios</li>
                  <li>Incumplimientos de los Usuarios Comercio con los Usuarios Miembro</li>
                  <li>Calidad, idoneidad o legalidad de los productos ofrecidos por Usuarios Comercio</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">27. PROTECCIÓN DE DATOS PERSONALES</h3>
                <p className="text-gray-700 leading-relaxed">
                  WEINCARD se compromete a proteger los datos personales de sus usuarios de conformidad con la Ley 1581
                  de 2012 y demás normas aplicables. Para más información, consulte nuestra{" "}
                  <Link href="/politica-de-privacidad" className="text-[#8B2332] hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">29. LEY APLICABLE Y JURISDICCIÓN</h3>
                <p className="text-gray-700 leading-relaxed">
                  Los presentes TyC se regirán e interpretarán de conformidad con las leyes de la República de Colombia.
                  Cualquier controversia que surja en relación con estos TyC será sometida a la jurisdicción exclusiva
                  de los jueces y tribunales de Medellín, Colombia.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">30. MODIFICACIONES</h3>
                <p className="text-gray-700 leading-relaxed">
                  WEINCARD se reserva el derecho de modificar estos TyC en cualquier momento. Las modificaciones
                  entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado de la
                  plataforma después de la publicación de las modificaciones constituye la aceptación de los nuevos
                  términos.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">31. NULIDAD PARCIAL</h3>
                <p className="text-gray-700 leading-relaxed">
                  Si cualquier disposición de estos TyC es declarada nula o inexigible por una autoridad competente,
                  dicha nulidad no afectará la validez y vigencia de las demás disposiciones.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-black mb-2">32. CESIÓN</h3>
                <p className="text-gray-700 leading-relaxed">
                  El Usuario no podrá ceder, transferir o sublicenciar sus derechos u obligaciones bajo estos TyC sin el
                  consentimiento previo y por escrito de WEINCARD. WEINCARD podrá ceder estos TyC en cualquier momento
                  sin necesidad de obtener el consentimiento del Usuario.
                </p>
              </div>
            </div>
          </section>

          {/* Información de contacto */}
          <section className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="font-semibold text-lg text-black mb-3">Información de Contacto</h3>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>Razón Social:</strong> WEINCARD S.A.S.
              </p>
              <p>
                <strong>NIT:</strong> 901969791-5
              </p>
              <p>
                <strong>Domicilio:</strong> Medellín, Colombia
              </p>
              <p>
                <strong>Correo electrónico:</strong> weincardco@gmail.com
              </p>
              <p>
                <strong>Página web:</strong> https://www.weincard.com
              </p>
            </div>
          </section>

          <div className="text-center text-sm text-gray-600 pt-8 border-t">
            <p>Última actualización: Septiembre 19, 2025</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 WEINCARD S.A.S. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
