--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-04-30
-- Description:  Retrieves the rating of a post
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_GetPostRating]
    -- Parameters
    @IN_currentEmail VARCHAR(128) = NULL,
    @IN_postId INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @userId INT = NULL;
    DECLARE @currentUserRating INT = NULL;

    BEGIN TRY

        -- VALIDATIONS
        IF NOT EXISTS (SELECT 1
                       FROM Posts P
                       WHERE P.postId = @IN_postId)
            BEGIN
                RAISERROR ('No existe el emprendimiento.', 16, 1);
            END;

        IF @IN_currentEmail IS NOT NULL
            BEGIN
                SELECT @userId = userId
                FROM Users
                WHERE email = @IN_currentEmail;

                IF @userId IS NULL
                    BEGIN
                        RAISERROR ('No existe el usuario.', 16, 1);
                    END;

                SELECT @currentUserRating = rating
                FROM Reviews
                WHERE postId = @IN_postId
                  AND authorId = @userId;
            END

        SELECT @IN_postId         AS 'postId',
               P.rating           AS 'rating',
               @currentUserRating AS 'userRating'
        FROM Posts P
        WHERE P.postId = @IN_postId;

    END TRY
    BEGIN CATCH

        SET @ErrorNumber = ERROR_NUMBER();
        SET @ErrorSeverity = ERROR_SEVERITY();
        SET @ErrorState = ERROR_STATE();
        SET @Message = ERROR_MESSAGE();

        IF @transactionStarted = 1
            BEGIN
                ROLLBACK;
            END;

        IF @ErrorNumber != 50000
            BEGIN
                -- If it's not a custom error, log the error
                INSERT INTO [dbo].[Errors]
                VALUES (SUSER_NAME(),
                        ERROR_NUMBER(),
                        ERROR_STATE(),
                        ERROR_SEVERITY(),
                        ERROR_LINE(),
                        ERROR_PROCEDURE(),
                        ERROR_MESSAGE(),
                        GETUTCDATE());
            END;

        RAISERROR ('%s - Error Number: %i',
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;