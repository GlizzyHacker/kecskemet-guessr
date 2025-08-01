-- Create view
CREATE VIEW "ImageScore" AS
SELECT
    i.id AS id,
    COALESCE(SUM(g.vote), 0) AS score,
FROM
    "Image" i
LEFT JOIN
    "Round" r ON r."imageId" = i.id
LEFT JOIN
    "Guess" g ON g."roundId" = r.id
GROUP BY
    i.id;
