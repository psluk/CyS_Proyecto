import { useMemo, useRef } from "react";
import { Marker } from "react-leaflet";

export default function DraggableMarker(props) {
  const { children, position, setPosition, ...otherProps } = props;
  const markerRef = useRef(null);
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker !== null) {
        setPosition(marker.getLatLng());
      }
    }
  }));

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      {...otherProps}
    >
      {children}
    </Marker>
  );
}