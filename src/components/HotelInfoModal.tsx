import { useState } from 'react'
import { X, MapPin, Phone, Check } from 'lucide-react'

interface HotelInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (hotelInfo: { name: string; room: string; phone?: string }) => void
  hotels: Array<{ id: string; name: string }>
  language?: 'es' | 'en'
}

const HotelInfoModal: React.FC<HotelInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  hotels,
  language = 'es'
}) => {
  const [hotelName, setHotelName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customHotel, setCustomHotel] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hotelName && roomNumber) {
      onSubmit({
        name: hotelName,
        room: roomNumber,
        phone: phoneNumber || undefined
      })
      onClose()
    }
  }

  const texts = {
    es: {
      title: '¿Dónde te lo llevamos?',
      subtitle: 'Para que te lleven el pedido a tu hotel',
      hotelLabel: 'Hotel o hospedaje',
      roomLabel: 'Habitación / Cabaña',
      phoneLabel: 'Celular de contacto (opcional)',
      customHotel: 'Otro hotel (escribir nombre)',
      submit: 'Continuar al pedido',
      selectHotel: 'Selecciona tu hotel',
      placeholderRoom: 'Ej: 204, Cabaña 3, Recepción',
      placeholderPhone: '300 000 0000',
      note: 'El comercio confirmará el pedido antes de salir'
    },
    en: {
      title: 'Where should we deliver?',
      subtitle: 'So they can deliver your order to your hotel',
      hotelLabel: 'Hotel or accommodation',
      roomLabel: 'Room / Cabin',
      phoneLabel: 'Contact phone (optional)',
      customHotel: 'Other hotel (write name)',
      submit: 'Continue to order',
      selectHotel: 'Select your hotel',
      placeholderRoom: 'Ex: 204, Cabin 3, Reception',
      placeholderPhone: '300 000 0000',
      note: 'The business will confirm the order before leaving'
    }
  }

  const t = texts[language]

  return (
    <div className="hotel-info-modal-overlay" onClick={onClose}>
      <div className="hotel-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="hotel-form">
          <div className="form-group">
            <label>
              <MapPin size={16} />
              {t.hotelLabel}
            </label>
            
            {!customHotel ? (
              <select 
                value={hotelName} 
                onChange={(e) => setHotelName(e.target.value)}
                required
              >
                <option value="">{t.selectHotel}</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                ))}
                <option value="custom">{t.customHotel}</option>
              </select>
            ) : (
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder={language === 'es' ? 'Nombre del hotel' : 'Hotel name'}
                required
              />
            )}
            
            {!customHotel && (
              <button 
                type="button" 
                className="text-link"
                onClick={() => setCustomHotel(true)}
              >
                {t.customHotel}
              </button>
            )}
          </div>

          <div className="form-group">
            <label>
              <MapPin size={16} />
              {t.roomLabel}
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder={t.placeholderRoom}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Phone size={16} />
              {t.phoneLabel}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.placeholderPhone}
            />
          </div>

          <div className="form-note">
            <Check size={16} />
            <span>{t.note}</span>
          </div>

          <button type="submit" className="submit-button">
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HotelInfoModal