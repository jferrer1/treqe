import { Link } from "react-router-dom";


export function FaqPage() {
  return (
    <>
      <div className="treqe-header">
  <div className="treqe-header__left">
    <button className="treqe-header__back"  aria-label="Atrás"><i className="fas fa-chevron-left"></i></button>
    <span className="treqe-header__title">FAQ</span>
  </div>
  <div className="treqe-header__right"></div>
</div>

<div className="container">
  <h2>Preguntas frecuentes</h2>

  <div className="faq-item">
    <h3>¿Cómo funciona el intercambio circular?</h3>
    <p>Publicas un artículo que ya no usas, eliges uno que quieres recibir, y el algoritmo encuentra un círculo de personas donde todos dan y todos reciben. Tú no intercambias directamente con nadie: la comunidad cierra el círculo. Si tu artículo vale menos que el que quieres, pagas la diferencia. Si vale más, recibes dinero.</p>
  </div>

  <div className="faq-item">
    <h3>¿Es obligatorio intercambiar? ¿Puedo comprar directamente?</h3>
    <p>Tienes dos caminos. Puedes usar la compra directa: ves un artículo, pagas su precio y lo recibes en casa, como en cualquier tienda. O puedes usar el intercambio circular: ofreces algo a cambio y el algoritmo encuentra el círculo perfecto. O incluso combinar ambas: ofrecer un objeto y pagar la diferencia si no llega al valor.</p>
  </div>

  <div className="faq-item">
    <h3>¿Se usa dinero en Treqe?</h3>
    <p>Sí. Treqe no es trueque puro. Si tu objeto vale menos que lo que quieres, pagas la diferencia. Si vale más, la recibes. Es intercambio inteligente con ajuste monetario. Además, puedes comprar directamente sin intercambiar nada.</p>
  </div>

  <div className="faq-item">
    <h3>¿Cómo funciona "Quiero esto"?</h3>
    <p>Cuando ves un artículo que te interesa, pulsas "Quiero esto" y ofreces algo tuyo a cambio. Tu oferta entra en un sistema silencioso donde otras personas también pueden haber ofrecido. El algoritmo busca la mejor combinación posible entre todos los interesados. No es "el primero que llega se lo queda": se optimiza para que el máximo número de personas consiga lo que quiere.</p>
  </div>

  <div className="faq-item">
    <h3>¿Cuánto tardan los envíos?</h3>
    <p>Los envíos nacionales suelen llegar en 24-72 horas. Los internacionales pueden tardar entre 5 y 10 días laborables. En cuanto el vendedor entrega el paquete, recibes un número de seguimiento para saber dónde está en todo momento.</p>
  </div>

  <div className="faq-item">
    <h3>¿Qué pasa si el artículo no coincide con la descripción?</h3>
    <p>Tienes 24 horas desde la recepción para abrir una disputa. Si procede, se cancela el intercambio y recuperas tu artículo. El sistema de escrow retiene el pago hasta que confirmes que todo está bien, así que tu dinero está protegido.</p>
  </div>

  <div className="faq-item">
    <h3>¿Hay comisiones?</h3>
    <p>El intercambio circular directo no tiene comisiones. La compra directa tiene una comisión del 5% que cubre el seguro y el servicio de escrow. El envío se paga aparte según el peso y la distancia.</p>
  </div>

  <div className="faq-item">
    <h3>¿Cómo verifico mi identidad?</h3>
    <p>Ve a tu perfil, pulsa en "Verificar identidad" y sube una foto de tu DNI o NIE junto con un selfie. El proceso tarda menos de 2 minutos. Verificar tu identidad aumenta tu reputación y la confianza de otros usuarios en ti.</p>
  </div>

  <div className="faq-item">
    <h3>¿Cómo funciona el sistema de reputación?</h3>
    <p>Cada vez que completas un intercambio o una compra, puedes valorar a la otra persona con 1 a 5 estrellas. Además, verificaciones, antigüedad y actividad suman puntos a tu scoring. Una reputación alta te da prioridad en los círculos de intercambio.</p>
  </div>

  <div className="faq-item">
    <h3>¿Qué es el escrow y cómo me protege?</h3>
    <p>El escrow es un sistema de garantía: cuando pagas por un artículo, el dinero no va directamente al vendedor. Se retiene en una cuenta segura hasta que confirmas que has recibido el artículo y que todo está correcto. Solo entonces se libera el pago. Si algo va mal, puedes abrir una disputa y el dinero no se pierde.</p>
  </div>

  <div className="faq-item">
    <h3>¿Puedo ofrecer varios artículos a cambio de uno?</h3>
    <p>Sí. Puedes ofrecer un artículo más una cantidad de dinero para ajustar la diferencia de valor. En futuras versiones, también podrás combinar varios objetos en una misma oferta.</p>
  </div>

  <div className="faq-item">
    <h3>¿Cómo puedo contactar con soporte?</h3>
    <p>Ve a Ajustes → Contactar soporte, o escribe a hola@treqe.es. Te responderemos en menos de 24 horas.</p>
  </div>
</div>
    </>
  );
}
