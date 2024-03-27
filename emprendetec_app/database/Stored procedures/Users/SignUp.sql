--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-03-26
-- Description:  Creates a new user in the database after they sign up
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_Users_SignUp]
    -- Parameters
    @IN_firebaseUid     VARCHAR(128),
    @IN_givenName       VARCHAR(32),
    @IN_familyName      VARCHAR(32),
    @IN_email           VARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @userType VARCHAR(32) = 'Student';
    DECLARE @userTypeId INT;

    BEGIN TRY

        -- VALIDATIONS

        -- Check if the user type exists
        SELECT  @userTypeId = UT.[userTypeId]
        FROM    [dbo].[UserTypes] UT
        WHERE   UT.[roleName] = @userType;

        IF @userTypeId IS NULL
        BEGIN
            RAISERROR('No existe el tipo de usuario.', 16, 1);
        END;

        -- Check if the email is already in use
        IF EXISTS
        (
            SELECT  1
            FROM    [dbo].[Users] U
            WHERE   U.[email] = @IN_email
        )
        BEGIN
            RAISERROR('El correo "%s" ya está en registrado.', 16, 1, @IN_email);
        END;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
            SET @transactionStarted = 1;
            BEGIN TRANSACTION;
        END;

        -- Insert the user
        INSERT INTO [dbo].[Users]
        (
            [userTypeId],
            [firebaseUid],
            [givenName],
            [familyName],
            [email],
            [signUpTimestamp]
        )
        VALUES
        (
            @userTypeId,
            @IN_firebaseUid,
            @IN_givenName,
            @IN_familyName,
            @IN_email,
            GETUTCDATE()
        );

        -- COMMIT TRANSACTION
        IF @transactionStarted = 1
        BEGIN
            COMMIT TRANSACTION;
        END;

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
        VALUES
            (
                SUSER_NAME(),
                ERROR_NUMBER(),
                ERROR_STATE(),
                ERROR_SEVERITY(),
                ERROR_LINE(),
                ERROR_PROCEDURE(),
                ERROR_MESSAGE(),
                GETUTCDATE()
            );
    END;

        RAISERROR('%s - Error Number: %i', 
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;