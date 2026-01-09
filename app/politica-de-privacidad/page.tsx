import Image from "next/image"
import Link from "next/link"

export default function PoliticaPrivacidadPage() {
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
        <h1 className="font-clash text-4xl md:text-5xl font-bold text-black mb-8">
          Política de Tratamiento de la Información Personal
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Introducción */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              En cumplimiento de las disposiciones contenidas en el artículo 15 de la Constitución Política, Ley 1581 de
              2012, Decreto reglamentario 1377 de 2013, y demás normas que lo modifiquen, adicionen, complementen o
              desarrollen, la compañía WEINCARD S.A.S., en adelante WEINCARD, comprometida con el respeto y garantía de
              los derechos de sus afiliados, proveedores, empleados y terceros en general, da a conocer las políticas y
              procedimientos de tratamiento de datos personales que se encuentran guardados y custodiados en nuestra
              base de datos, las cuales son de obligatorio cumplimiento en todas las actividades que involucre, total o
              parcialmente, la recolección, almacenamiento, uso, circulación y/o transferencia de dicha información.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              La presente Política de Tratamiento de Información Personal es de obligatorio cumplimiento para WEINCARD,
              en calidad de responsable, así como para todas las compañías aliadas, filiales o que hacen parte del grupo
              empresarial de esta.
            </p>
          </section>

          {/* Marco Jurídico */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">1. MARCO JURÍDICO</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              La presente Política de Tratamiento de la información personal tiene su sustento normativo en el artículo
              15 de la Constitución Política, en la Ley 1581 de 2012, Decreto reglamentario 1377 de 2013, los cuales
              disponen:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-black mb-3">Constitución Política</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Artículo 15.</strong> Todas las personas tienen derecho a su intimidad personal y familiar y a
                su buen nombre, y el Estado debe respetarlos y hacerlos respetar. De igual modo, tienen derecho a
                conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bancos de datos
                y en archivos de entidades públicas y privadas.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-3">
                En la recolección, tratamiento y circulación de datos se respetarán la libertad y demás garantías
                consagradas en la Constitución.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-3">
                La correspondencia y demás formas de comunicación privada son inviolables. Sólo pueden ser interceptadas
                o registradas mediante orden judicial, en los casos y con las formalidades que establezca la ley.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-3">
                Para efectos tributarios o judiciales y para los casos de inspección, vigilancia e intervención del
                Estado podrá exigirse la presentación de libros de contabilidad y demás documentos privados, en los
                términos que señale la ley.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <h3 className="font-semibold text-black mb-3">Ley Estatutaria 1581 de 2012</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Por la cual se dictan disposiciones generales para la protección de datos personales"
              </p>
            </div>
          </section>

          {/* Información General */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              2. INFORMACIÓN GENERAL DE WEINCARD COMO RESPONSABLE DEL TRATAMIENTO DE DATOS PERSONALES
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Razón social:</strong> WEINCARD S.A.S.
              </p>
              <p>
                <strong>NIT:</strong> 901969791-5
              </p>
              <p>
                <strong>Domicilio:</strong> Medellín
              </p>
              <p>
                <strong>Correo electrónico:</strong> weincardco@gmail.com
              </p>
              <p>
                <strong>Página web:</strong> https://www.weincard.com
              </p>
            </div>
          </section>

          {/* Objeto */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              3. OBJETO DE LA POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
            </h2>
            <p className="text-gray-700 leading-relaxed">
              La Política de Tratamiento de datos personales tiene por objeto desarrollar y dar a conocer al público en
              general los lineamientos corporativos y de Ley bajo los cuales WEINCARD realizar el tratamiento de los
              datos personales, la finalidad del tratamiento, los derechos que le asisten a los titulares, así como los
              procedimientos internos y externos que existen para el ejercicio de tales derechos ante WEINCARD, entre
              otros.
            </p>
          </section>

          {/* Definiciones */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">4. DEFINICIONES LEGALES</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para efectos de la ejecución de la presente política y de conformidad con la normatividad legal, serán
              aplicables las siguientes definiciones:
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700">
                  <strong>a) Autorización:</strong> Consentimiento previo, expreso e informado del Titular para llevar a
                  cabo el Tratamiento de datos personales;
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>b) Base de Datos:</strong> Conjunto organizado de datos personales que sea objeto de
                  Tratamiento;
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>c) Titular:</strong> Persona natural cuyos datos personales sean objeto de Tratamiento, sea
                  cliente, proveedor, empleado, o cualquier tercero que, en razón de una relación comercial o jurídica,
                  suministre datos personales a WEINCARD.
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>d) Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales,
                  tales como la recolección, almacenamiento, uso, circulación o supresión
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>e) Dato personal:</strong> Cualquier información vinculada o que pueda asociarse a una o
                  varias personas naturales determinadas o determinables;
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>f) Dato público:</strong> Es el dato que no sea semiprivado, privado o sensible. Son
                  considerados datos públicos, entre otros, los datos relativos al estado civil de las personas, a su
                  profesión u oficio y a su calidad de comerciante o de servidor público.
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>g) Datos sensibles:</strong> Se entiende por datos sensibles aquellos que afectan la intimidad
                  del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el
                  origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la
                  pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de
                  cualquier partido político o que garanticen los derechos y garantías de partidos políticos de
                  oposición, así como los datos relativos a la salud, a la vida sexual, y los datos biométricos.
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>h) Transferencia:</strong> La transferencia de datos tiene lugar cuando el Responsable y/o
                  Encargado del Tratamiento de datos personales, ubicado en Colombia, envía la información o los datos
                  personales a un receptor, que a su vez es Responsable del Tratamiento y se encuentra dentro o fuera
                  del país.
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>i) Transmisión:</strong> Tratamiento de datos personales que implica la comunicación de los
                  mismos dentro o fuera del territorio de la República de Colombia cuando tenga por objeto la
                  realización de un Tratamiento por el Encargado por cuenta del Responsable.
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4 text-sm italic">
              Cuando un término usado está definido en la presente Política de tratamiento de información, se estará a
              esa definición. Asimismo, cuando un término usado no esté definido expresamente en este documento ni en la
              Ley aplicable, se estará al significado literal de las estipulaciones, siempre que tal interpretación
              resulte consistente con el objeto de la Política de tratamiento de información.
            </p>
          </section>

          {/* Principios */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              5. PRINCIPIOS QUE GOBIERNAN EL ACTUAR DE WEINCARD EN EL TRATAMIENTO DE DATOS PERSONALES
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Los principios que rigen el Tratamiento de los Datos Personales por parte de WEINCARD son los siguientes:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>− Principio de legalidad:</strong> el Tratamiento de los datos personales es una actividad
                reglada que debe sujetarse a lo establecido en la Ley 1581 de 2012 en el Decreto 1377 de 2013 y en las
                demás disposiciones que las desarrollen.
              </li>
              <li>
                <strong>− Principio de finalidad:</strong> la finalidad del Tratamiento debe ser legítima, e informada
                al titular.
              </li>
              <li>
                <strong>− Principio de límite razonable:</strong> se limitará el almacenamiento y procesamiento de datos
                personales a lo que es esencialmente necesario para cumplir los propósitos previamente especificados de
                la relación de negocios, así como el cumplimiento de los fines autorizados por el Titular.
              </li>
              <li>
                <strong>− Principio de libertad:</strong> los datos personales sólo pueden ser tratados con el
                consentimiento previo, expreso e informado del Titular o por mandato legal o judicial.
              </li>
              <li>
                <strong>− Principio de veracidad:</strong> la información debe ser veraz, completa, exacta, actualizada,
                comprobable y comprensible.
              </li>
              <li>
                <strong>− Principio de transparencia:</strong> se debe garantizar el derecho del Titular a obtener
                información sobre sus datos personales cuyo Tratamiento sea realizado por WEINCARD.
              </li>
              <li>
                <strong>− Principio de Acceso y circulación restringida:</strong> el Tratamiento solo podrá hacerse por
                personas autorizadas por el Titular o por las personas previstas en la Ley.
              </li>
              <li>
                <strong>− Principio de Seguridad:</strong> la información debe manejarse con las medidas necesarias para
                otorgar seguridad a los registros y evitar su adulteración, pérdida, consulta, uso o acceso no
                autorizado o fraudulento.
              </li>
              <li>
                <strong>− Principio de Confidencialidad:</strong> los datos personales que no tengan la naturaleza de
                públicos son reservados y sólo se pueden suministrar en los términos de la Ley.
              </li>
              <li>
                <strong>− Principio de Incorporación sistemática:</strong> los principios de Protección de Datos
                Personales se implementarán en todos los procesos y procedimientos de la actividad comercial de
                WEINCARD.
              </li>
            </ul>
          </section>

          {/* Derechos */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              6. DERECHOS QUE LE ASISTEN A LOS TITULARES DE LOS DATOS PERSONALES
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>a)</strong> Conocer, actualizar y rectificar sus datos personales frente a los Responsables del
                Tratamiento o Encargados del Tratamiento. Este derecho se podrá ejercer, entre otros frente a datos
                parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté
                expresamente prohibido o no haya sido autorizado;
              </li>
              <li>
                <strong>b)</strong> Solicitar prueba de la autorización otorgada al Responsable del Tratamiento salvo
                cuando expresamente se exceptúe como requisito para el Tratamiento, de conformidad con lo previsto en el
                artículo 10 de la ley de Habeas Data
              </li>
              <li>
                <strong>c)</strong> Ser informado por el Responsable del Tratamiento o el Encargado del Tratamiento,
                previa solicitud, respecto del uso que le ha dado a sus datos personales;
              </li>
              <li>
                <strong>d)</strong> Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a
                lo dispuesto en la ley y las demás normas que la modifiquen, adicionen o complementen;
              </li>
              <li>
                <strong>e)</strong> Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento
                no se respeten los principios, derechos y garantías constitucionales y legales. La revocatoria y/o
                supresión procederá cuando la Superintendencia de Industria y Comercio haya determinado que en el
                Tratamiento el Responsable o Encargado han incurrido en conducas contrarias a la ley y a la
                Constitución;
              </li>
              <li>
                <strong>f)</strong> Acceder en forma gratuita a sus datos personales que hayan sido objeto de
                Tratamiento.
              </li>
            </ul>
          </section>

          {/* Autorización */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              7. AUTORIZACIÓN PARA EL TRATAMIENTO DE LOS DATOS PERSONALES
            </h2>
            <p className="text-gray-700 leading-relaxed">
              WEINCARD actuando como Responsable del Tratamiento ha adoptado procedimientos para solicitarle, a más
              tardar en el momento de la recolección de sus datos personales, su autorización para el Tratamiento de los
              mismos e informarle cuáles son los datos personales que serán recolectados, así como todas las finalidades
              específicas del Tratamiento para las cuales se obtiene su consentimiento.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Se entenderá que el Titular ha otorgado a WEINCARD Autorización para el Tratamiento de sus datos
              personales cuando ésta se manifieste: (i) por escrito; (ii) de forma oral; o (iii) mediante conductas
              inequívocas del Titular que permitan concluir de forma razonable que éste otorgó a WEINCARD la
              autorización respectiva. En ningún caso el silencio será entendido como una conducta inequívoca.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              No obstante lo anterior, la autorización del Titular no será necesaria cuando se trate de: (i) Información
              requerida por una entidad pública o administrativa en ejercicio de sus funciones legales o por orden
              judicial; (ii) Datos de naturaleza pública; (iii) Casos de urgencia médica o sanitaria; (iv) Tratamiento
              de información autorizado por la ley para fines históricos, estadísticos o científicos; y (v) Datos
              relacionados con el Registro Civil de las Personas
            </p>
          </section>

          {/* Revocatoria */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              8. REVOCATORIA DE LA AUTORIZACIÓN Y/O SUPRESIÓN DEL DATO
            </h2>
            <p className="text-gray-700 leading-relaxed">
              El Titular de los datos personales puede en todo momento solicitar a WEINCARD revocar la autorización que
              ha otorgado para el Tratamiento de los mismos, mediante la presentación de un reclamo, de acuerdo con lo
              establecido en el artículo 15 de la Ley 1581 de 2012.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              No obstante lo anterior, advertimos que la solicitud de supresión de la información y/o la revocatoria de
              la autorización no procederá cuando como Titular de los datos personales tenga un deber legal o
              contractual en virtud del cual deba permanecer en la base de datos de WEINCARD.
            </p>
          </section>

          {/* Finalidad */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              9. FINALIDAD DEL TRATAMIENTO DE LOS DATOS PERSONALES
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              WEINCARD realizará el tratamiento de los datos personales con las siguientes finalidades:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>i.</strong> Realizar, a través de cualquier medio en forma directa o a través de terceros,
                actividades de mercadeo, promoción y/o publicidad propia o de terceros, venta, facturación, gestión de
                cobranza, recaudo, programación, soporte técnico, inteligencia de mercados, mejoramiento del servicio,
                verificaciones y consultas, control, comportamiento, hábito y habilitación de medios de pago, prevención
                de fraude, así como cualquier otra relacionada con nuestros productos y servicios, actuales y futuros,
                para el cumplimiento de las obligaciones contractuales y de nuestro objeto social.
              </li>
              <li>
                <strong>ii.</strong> Generar una comunicación óptima en relación con nuestros servicios, productos,
                promociones, facturación y demás actividades.
              </li>
              <li>
                <strong>iii.</strong> Evaluar la calidad de nuestros productos y servicios y realizar estudios sobre
                hábitos de consumo, preferencia, interés de compra, prueba de producto, concepto, evaluación del
                servicio, satisfacción y otras relacionadas con nuestros servicios y productos.
              </li>
              <li>
                <strong>iv.</strong> Prestar asistencia, servicio y soporte técnico de nuestros productos y servicios.
              </li>
              <li>
                <strong>v.</strong> Realizar las gestiones necesarias para dar cumplimiento a las obligaciones
                inherentes a los servicios prestados por WEINCARD.
              </li>
              <li>
                <strong>vi.</strong> Cumplir con las obligaciones contraídas con nuestros afiliados, aliados, usuarios,
                proveedores, sus filiales, distribuidores, subcontratistas y demás personas relacionadas directa o
                indirectamente con el objeto social de WEINCARD.
              </li>
              <li>
                <strong>vii.</strong> Controlar y prevenir el fraude en todas sus modalidades.
              </li>
              <li>
                <strong>viii.</strong> Consultar y reportar información en centrales de riesgo, listas nacionales e
                internacionales para la prevención del lavado de activos y financiación del terrorismo.
              </li>
            </ul>
          </section>

          {/* Procedimiento Consultas */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              10. PROCEDIMIENTO PARA LA ATENCIÓN DE SOLICITUDES Y CONSULTAS RELACIONADOS CON LA INFORMACIÓN PERSONAL
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              El Titular de los datos personales o quien esté autorizado debidamente podrá:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
              <li>
                Formular solicitudes y consultas para conocer la información personal del Titular que reposa en
                WEINCARD.
              </li>
              <li>
                Solicitar la actualización, modificación, rectificación o supresión de los datos del Titular, cuando
                haya lugar a ello de conformidad con la presente Política y con la Ley aplicable.
              </li>
              <li>
                Solicitar copia de la autorización otorgada por el Titular a WEINCARD para realizar el Tratamiento de
                sus Datos Personales.
              </li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-4">
              Estas consultas se podrán realizar de forma gratuita al menos una vez cada mes calendario y cada vez que
              existan modificaciones sustanciales de las Políticas de Tratamiento de la información que motiven nuevas
              consultas.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="text-gray-700 mb-2">
                El Titular o quien esté autorizado para ello, podrá formular consultas WEINCARD sobre la información
                personal del Titular a través de los siguientes mecanismos:
              </p>
              <p className="text-gray-700">
                <strong>− Correo electrónico:</strong> weincardco@gmail.com
              </p>
              <p className="text-gray-700 mt-4 text-sm">
                La consulta será atendida en un término máximo de diez (10) días hábiles contados a partir de la fecha
                de recibo de la misma.
              </p>
              <p className="text-gray-700 mt-3 text-sm">
                Cuando no fuere posible atender la consulta dentro del término antes indicado, WEINCARD lo informará al
                interesado, expresando los motivos y señalando la fecha en que se atenderá su consulta, a más tardar
                dentro de los cinco (5) días hábiles siguientes al vencimiento del primer término.
              </p>
            </div>
          </section>

          {/* Procedimiento Reclamos */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              11. PROCEDIMIENTO PARA LA ATENCIÓN DE RECLAMOS Y REVOCATORIA DE LA AUTORIZACIÓN DEL TRATAMIENTO DE DATOS
              PERSONALES
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mediante este procedimiento el Titular o quien esté autorizado debidamente podrá:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Revocar la Autorización para el Tratamiento de Datos.</li>
              <li>
                Presentar reclamos cuando considere que existe un presunto incumplimiento de los deberes de WEINCARD
                relacionados con el Tratamiento de Datos Personales, de acuerdo con lo previsto en estas Políticas o en
                la Ley de Protección de Datos Personales.
              </li>
            </ol>

            <h3 className="font-semibold text-lg text-black mt-6 mb-3">
              Revocatoria de la Autorización del Titular para el Tratamiento de Datos personales.
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              El Titular podrá revocar la autorización y solicitar la supresión de sus datos en los siguientes eventos:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>
                <strong>−</strong> Por decisión unilateral, libre y voluntaria del Titular de los Datos Personales,
                cuando no exista una obligación legal o contractual que imponga al Titular el deber de permanecer en la
                base de datos; y
              </li>
              <li>
                <strong>−</strong> Cuando no se respeten los principios, derechos y garantías constitucionales y
                legales, siempre y cuando la Superintendencia de Industria y Comercio haya determinado que en el
                Tratamiento el Responsable o Encargado han incurrido en conductas contrarias al ordenamiento.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 text-sm">
              Lo anterior, sin perjuicio de las normas que WEINCARD debe observar en materia de retención documental
              para el cumplimiento de obligaciones formales. En consecuencia, WEINCARD suprimirá los datos o suspenderá
              su uso cuando a ello haya lugar, respetando las normas sobre conservación documental que le son
              aplicables.
            </p>

            <h3 className="font-semibold text-lg text-black mt-6 mb-3">
              El procedimiento para la atención de los reclamos sobre los datos personales del Titular es el siguiente:
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              El Titular o quien esté autorizado debidamente para ello, podrán formular reclamos a WEINCARD en relación
              con el Tratamiento de sus Datos personales, en los siguientes eventos:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>
                <strong>−</strong> Cuando considere que la información del Titular contenida en una base de datos debe
                ser objeto de corrección, actualización o supresión; o
              </li>
              <li>
                <strong>−</strong> Cuando advierta el presunto incumplimiento de cualquiera de los deberes contenidos en
                la Ley de Protección de Datos.
              </li>
            </ul>

            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="text-gray-700 mb-3">
                La formulación de reclamos deberá realizarse a través de cualquiera de los siguientes canales de
                atención:
              </p>
              <p className="text-gray-700">
                <strong>− Correo electrónico:</strong> weincardco@gmail.com
              </p>
              <p className="text-gray-700 mt-4">
                El reclamo presentado por el Titular o por el autorizado para ello, deberá contener como mínimo lo
                siguiente:
              </p>
              <ul className="text-gray-700 space-y-2 mt-3 ml-4 text-sm">
                <li>(i) Identificación del Titular de los Datos Personales;</li>
                <li>(ii) Descripción de los hechos que dan lugar al reclamo;</li>
                <li>(iii) Datos de contacto y ubicación del Titular de los Datos Personales;</li>
                <li>(iv) Los documentos o pruebas que soportan su reclamación.</li>
              </ul>
              <p className="text-gray-700 mt-4 text-sm">
                En caso de no contar con la anterior información, se entenderá que el reclamo no se encuentra completo.
              </p>
              <p className="text-gray-700 mt-4 text-sm">
                Si el reclamo está incompleto, WEINCARD solicitará al interesado subsanar las fallas o remitir la
                información o documentación que se requiera dentro de los cinco (5) días hábiles siguientes a la
                recepción del reclamo por parte de WEINCARD. Transcurridos dos (2) meses desde la fecha del
                requerimiento, sin que el solicitante presente la información requerida, se entenderá que ha desistido
                del reclamo y se procederá a su archivo.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>
                  WEINCARD cuenta con un término de quince (15) días hábiles para atender el reclamo, contados a partir
                  del día hábil siguiente a la fecha de recibo en WEINCARD.
                </strong>
              </p>
              <p className="text-gray-700 mt-3 text-sm">
                Cuando no fuere posible atender el reclamo dentro del término antes mencionado, WEINCARD informará al
                interesado los motivos de la demora y la fecha en que se atenderá su reclamo, la cual no podrá superar
                los ocho (8) días hábiles siguientes al vencimiento del primer término.
              </p>
            </div>

            <h3 className="font-semibold text-lg text-black mt-6 mb-3">
              Área Responsable de la Atención de Solicitudes, Consultas y Reclamos
            </h3>
            <p className="text-gray-700 leading-relaxed">
              El área de Servicio al Cliente de WEINCARD es la encargada de recibir las peticiones, consultas y reclamos
              del Titular de los Datos Personales relacionados con sus derechos a conocer, actualizar, rectificar y
              suprimir el Dato Personal y revocar la Autorización. Así mismo el área de Servicio al Cliente velará por
              la oportuna y adecuada respuesta que emita cada una de las áreas de WEINCARD a las solicitudes, consultas
              y reclamos de los Titulares de los Datos.
            </p>
          </section>

          {/* Vigencia */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">
              12. VIGENCIA DE LA POLÍTICA DE TRATAMIENTO DE LA INFORMACIÓN PERSONAL
            </h2>
            <p className="text-gray-700 leading-relaxed">
              La presente política de tratamiento de la información personal rige a partir del 19 de septiembre de 2025,
              y hasta el momento en que expresamente se revoque o modifique.
            </p>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="font-clash text-2xl font-bold text-black mb-4">13. MODIFICACIÓN DE LAS POLÍTICAS</h2>
            <p className="text-gray-700 leading-relaxed">
              Las modificaciones a estas políticas se informarán a través de la página web www.weincard.com; las que
              sean sustanciales se informarán previamente a los Titulares a través de este mismo medio antes de ser
              implementadas.
            </p>
          </section>

          <div className="text-center text-sm text-gray-600 pt-8 border-t">
            <p>Última actualización: Septiembre 19, 2025</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 WEINCARD S.A.S. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
