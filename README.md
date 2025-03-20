# Online Map Layer Server

## Info

### Kanton Zürich

* Version: 1.1.0 (für support von Polygon, LineString von WFS)

**Mehr OGD Daten**:

* https://maps.zh.ch/?topic=DasIstKeineGB2Karte&amp;amp;showtab=ogddownload
* 1: WFS-datenquelle
* 2: Alle Daten
* 3:
    * WFS-Version 1.1.0
    * Daten-Format: GML 3.1.1
    * Rest -> Standard
* 4: Url kopieren für Download
* OUTPUTFORMAT und MAXFEATURES entfernen...

### SBB / Opendatasoft

* Projektion: EPSG:4326 (wird hardcoded gesetzt, da keine info im datenset)

### Tool to convert Geo Date

https://geoconverter.infs.ch/wms

## Examples

| Description | URL |
| --- | --- |
| Abfallkübel in Stadt Luzern | `https://map.stadtluzern.ch/server/services/OGD/abfallkuebel/MapServer/WFSServer?request=GetCapabilities&service=WFS` |
| Brücken in Stadt Luzern | `https://map.stadtluzern.ch/server/services/OGD/brücke/MapServer/WFSServer?request=GetCapabilities&service=WFS` |
| SBB Brücken (GEOJSON) | `https://data.sbb.ch/api/v2/catalog/datasets/brucken/exports/geojson` |
| Kanton ZH Kunstbauten (177) (GEOJSON) | `https://maps.zh.ch/wfs/OGDZHWFS?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=ms%3Aogd-0177_giszhpub_tba_kunstbauten_p&SRSNAME=urn:ogc:def:crs:EPSG::2056&OUTPUTFORMAT=application%2Fjson%3B%20subtype%3Dgeojson` |
| Kanton ZH Kunstbauten Inventar (Flächen) | `https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Kunstbauteninventar?SERVICE=WFS&REQUEST=GetFeature&VERSION=1.1.0&typeName=view_kuba_flaechen` |
| Kanton ZH Kunstbauten Inventar (Linien) | `https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Kunstbauteninventar?SERVICE=WFS&REQUEST=GetFeature&VERSION=1.1.0&typeName=view_kuba_linien` |
| Kanton ZH Veloparkplätze | `https://maps.zh.ch/wfs/OGDZHWFS?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=ms%3Aogd-0053_giszhpub_ogd_veloparkieranlagen_p&SRSNAME=urn:ogc:def:crs:EPSG::2056&VERSION=1.1.0` |
| Kanton ZH Stromleitungen | `https://maps.zh.ch/wfs/OGDZHWFS?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=ms%3Aogd-0329_giszhpub_en_stromleitungen_l&SRSNAME=urn:ogc:def:crs:EPSG::2056` |
| Kanton ZH Stromanlagen | `https://maps.zh.ch/wfs/OGDZHWFS?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=ogd-0329_giszhpub_en_stromanlagen_p&SRSNAME=urn:ogc:def:crs:EPSG::2056` |