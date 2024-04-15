SELECT
  t.id,
  t.fechainicio,
  t.fechafinal,
  t.nombre,
  t.uuidsearch,
  ct.id AS idcategory,
  ct.nombre AS idcategorynombre,
  ce.nombre AS idestadonombre
FROM
  (
    (
      ticket t
      JOIN cat_ticket ct ON ((t.idcatticket = ct.id))
    )
    JOIN cat_estadoticket ce ON ((t.idestado = ce.id))
  )
WHERE
  (
    ((t.fechainicio) :: timestamp without time zone) :: date = CURRENT_DATE
  );